import Identity from '../identity';
import ScheduledCommand from './scheduledCommand';

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
      deliverer: this.deliverer
    });
    this.store.push(cmd);
  }

  commandsDue = async now => {
    let commands = await this.store.commands();
    return commands.filter(cmd => cmd.isDue(now));
  }

  deliverDueCommands = async(now) => {
    let dueCommands = await this.commandsDue(now);
    await Promise.all(dueCommands.map(async cmd => await this.deliver(cmd)));
    await this.store.complete(dueCommands);
  }

  deliver = async(cmd) => {
    this.deliverer.deliver({ service: cmd.service, target: cmd.target, command: cmd.command });
  }
}
