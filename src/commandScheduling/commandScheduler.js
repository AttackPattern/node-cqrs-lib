import Identity from '../identity';
import ScheduledCommand from './scheduledCommand';
import CommandFailure from './commandFailure';

export default class CommandScheduler {

  constructor({ store, clock, deliverer }) {
    this.store = store;
    this.clock = clock;
    this.deliverer = deliverer;
  }

  schedule = async({ service, target, command, clock, due }) => {
    command.$identity = Identity.system;
    let cmd = new ScheduledCommand({
      service: service,
      target: target,
      command: command,
      due: due,
      clock: clock || this.clock,
      attempts: 0
    });
    await this.store.push(cmd);
  }

  commandsDue = async now => {
    let commands = await this.store.commands();
    return commands.filter(cmd => cmd.isDue(now));
  }

  deliverDueCommands = async(now) => {
    let dueCommands = await this.commandsDue(now);
    await Promise.all(dueCommands.map(async cmd => await this.deliver(cmd)));
  }

  deliver = async(cmd) => {
    try {
      cmd.command.$scheduler.due = null;
      await this.deliverer.deliver({ service: cmd.service, target: cmd.target, command: cmd.command });
      cmd.command.$scheduler.attempts = cmd.attempts++;

      if (cmd.command.$scheduler.due) {
        await this.store.retry(cmd);
      }
      else {
        await this.store.complete(cmd);
      }
    }
    catch (error) {
      let failure = new CommandFailure({ error, command: cmd.command, $scheduler: { attempts: cmd.attempts } });
      if (!error.handler) {
        console.log('Unhandled error', error);
        throw error;
      }
      await error.handler.handleDeliveryError(failure, error.aggregate);
      if (failure.$scheduler.due) {
        cmd.command.$scheduler.due = failure.$scheduler.due;
        await this.store.retry(cmd);
      }
      else if (failure.cancelled) {
        console.log('retry cancelled');
        await this.store.complete(cmd);
      }
    }
  }
}
