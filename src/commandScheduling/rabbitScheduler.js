import Identity from '../auth/identity';
import Schedule from './schedule';
import CommandFailure, { Retry } from './commandFailure';

export default class RabbitScheduler {

  constructor({ channel, clock, deliverer }) {
    this.channel = channel;
    this.clock = clock;
    this.deliverer = deliverer;

    const q = 'scheduledCommands';
    channel.assertQueue(q, { durable: true }).then(() =>
      channel.consume(q, async message => {
        const command = JSON.parse(message.content);
        await this.deliver(command)
          .then(() => {
            channel.ack(message);
          })
          .catch(async error => {
            let failure = new CommandFailure({ error, command });
            if (error.handler) {
              await error.handler.handleDeliveryError(failure, error.aggregate);
            }
            channel.nack(message, false, failure.failureAction instanceof Retry && !message.fields.redelivered);
          });
      })
    );
    this.publish = async message => {
      await channel.sendToQueue(q, Buffer.from(message));
    };
  }

  schedule = async ({ service, target, clock, due, command }) => {
    command.$identity = Identity.system;
    command.$scheduler = new Schedule({
      service: service,
      target: target,
      due: due,
      clock: clock || this.clock
    });

    await this.publish(JSON.stringify(command));
  }

  execute = async ({ service, target, command }) => {
    command.$identity = Identity.system;
    command.$scheduler = new Schedule({
      service: service,
      target: target
    });

    await this.deliver(command);
  }

  deliver = async (command) => {
    return new Promise(async (resolve, reject) => {
      try {
        command.$scheduler.due = null;
        await this.deliverer.deliver({ service: command.$scheduler.service, target: command.$scheduler.target, command });
        resolve();
      }
      catch (error) {
        reject(error);
      }
    });
  }
}
