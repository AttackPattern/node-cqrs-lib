import queue from 'async/queue';

import Identity from '../auth/identity';
import Schedule from './schedule';
import CommandFailure from './commandFailure';

export default class CommandScheduler {

  constructor({ store, clock, deliverer }) {
    this.store = store;
    this.clock = clock;
    this.deliverer = deliverer;

    this.queue = queue(async (command, callback) => {
      if (command.$scheduler.isDue(clock.now())) {
        await this.deliver(command);
      }
      else {
        // TODO (brett) - Optimize so the queue isn't going instantaneously
        this.queue.push(command);
      }
      return callback();
    });

    setImmediate(async () => this.queue.push(await this.store.loadCommands()));
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

    await this.queue.push(await this.store.push(command));
  }

  deliver = async (command) => {
    try {
      console.log('delivering', command.$scheduler.service, command.type);
      command.$scheduler.due = null;
      await this.deliverer.deliver({ service: command.$scheduler.service, target: command.$scheduler.target, command });
      command.$scheduler.attempts = command.$scheduler.attempts + 1;

      if (command.$scheduler.due) {
        await this.store.retry(command);
      }
      else {
        await this.store.complete(command);
      }
    }
    catch (error) {
      let failure = new CommandFailure({ error, command });
      if (!error.handler) {
        console.log('Unhandled error', error);
        throw error;
      }
      await error.handler.handleDeliveryError(failure, error.aggregate);
      if (command.$scheduler.due) {
        await this.store.retry(command);
      }
      else if (failure.cancelled) {
        console.log('retry cancelled');
        await this.store.complete(command);
      }
    }
  }
}
