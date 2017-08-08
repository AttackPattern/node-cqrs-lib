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
    let cmd = new ScheduledCommand({
      service: service,
      target: target,
      command: { ...command, $identity: Identity.system },
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
      await this.deliverer.deliver({ service: cmd.service, target: cmd.target, command: cmd.command });
      await this.store.complete(cmd);
    }
    catch (err) {
      let failure = new CommandFailure({ command: cmd.command, attempts: cmd.attempts });
      await err.handler.handleDeliveryError(failure, err.aggregate);

      if (failure.nextRetry) {
        cmd.attempts++;
        await this.store.retry(cmd, failure.nextRetry);
      }
      else if (failure.cancelled) {
        console.log('retry cancelled');
        await this.store.complete(cmd);
      }
    }
  }
}
