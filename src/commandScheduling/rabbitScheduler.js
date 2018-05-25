import Identity from '../auth/identity';
import Schedule from './schedule';
import CommandFailure, { Retry, Cancel } from './commandFailure';

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
          .catch(error => {
            console.log('retry', error.failureAction instanceof Retry && !message.fields.redelivered);
            channel.nack(message, false, error.failureAction instanceof Retry && !message.fields.redelivered);
          });
      })
    );
    this.publish = async message => {
      await channel.sendToQueue(q, new Buffer(message));
    };
  }

  schedule = async ({ service, target, clock, due, command }) => {
    command.$identity = Identity.system;
    command.$scheduler = new Schedule({
      service: service,
      target: target,
      due: due,
      clock: clock || this.clock,
      attempts: 0
    });

    await this.publish(JSON.stringify(command));
  }

  execute = async ({ service, target, command }) => {
    command.$identity = Identity.system;
    command.$scheduler = new Schedule({
      service: service,
      target: target,
      attempts: 0
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
        let failure = new CommandFailure({ error, command });
        if (error.handler) {
          console.log('calling handler error handler');
          await error.handler.handleDeliveryError(failure, error.aggregate);
        }
        reject(failure);
      }
    });
  }
}
