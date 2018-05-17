import Identity from '../auth/identity';
import Schedule from './schedule';
import CommandFailure from './commandFailure';

export default class RabbitScheduler {

  constructor({ channel, clock, deliverer }) {
    this.channel = channel;
    this.clock = clock;
    this.deliverer = deliverer;

    const q = 'scheduledCommands';
    channel.assertQueue(q, { durable: true }).then(() =>
      channel.consume(q, async message => {
        const command = JSON.parse(message.content);
        console.log('cmd', command);
        await this.deliver(command);
        await channel.ack(message);
      })
    );
    this.publish = async message => {
      console.log('publishing', message);
      await channel.sendToQueue(q, new Buffer(message));
    };
  }

  schedule = async ({ service, target, clock, due, command }) => {
    console.log('rabbit.schedule');
    command.$identity = Identity.system;
    command.$scheduler = new Schedule({
      service: service,
      target: target,
      due: due,
      clock: clock || this.clock,
      attempts: 0
    });
    console.log('to call publish');
    await this.publish(JSON.stringify(command));

    // await this.queue.push(await this.store.push(command));
  }

  execute = async ({ service, target, command }) => {
    command.$identity = Identity.system;
    command.$scheduler = new Schedule({
      service: service,
      target: target,
      attempts: 0
    });

    await this.deliver(command, true);
  }

  deliver = async (command, immediate = false) => {
    try {
      command.$scheduler.due = null;
      await this.deliverer.deliver({ service: command.$scheduler.service, target: command.$scheduler.target, command });
      command.$scheduler.attempts = command.$scheduler.attempts + 1;

      // if (!immediate) {
      //   if (command.$scheduler.due) {
      //     await this.store.retry(command);
      //   }
      //   else {
      //     await this.store.complete(command);
      //   }
      // }
    }
    catch (error) {
      let failure = new CommandFailure({ error, command });
      if (!error.handler) {
        console.log('Unhandled error', error);
        throw error;
      }
      await error.handler.handleDeliveryError(failure, error.aggregate);
      // if (!immediate) {
      //   if (command.$scheduler.due) {
      //     await this.store.retry(command);
      //   }
      //   else if (failure.cancelled) {
      //     console.log('retry cancelled');
      //     await this.store.complete(command);
      //   }
      // }
    }
  }
}
