import Identity from '../identity';
import Schedule from './schedule';
import CommandFailure from './commandFailure';

export default class CommandScheduler {

  constructor({ store, clock, deliverer }) {
    this.store = store;
    this.clock = clock;
    this.deliverer = deliverer;
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
    await this.store.push(command);
  }

  commandsDue = async now => {
    let commands = await this.store.commands();
    return commands.filter(cmd => cmd.$scheduler.isDue(now));
  }

  deliverDueCommands = async (now) => {
    let dueCommands = await this.commandsDue(now);
    await Promise.all(dueCommands.map(async cmd => await this.deliver(cmd)));
  }

  deliver = async (command) => {
    try {
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
