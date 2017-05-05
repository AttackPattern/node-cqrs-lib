export default class CommandScheduler {

  constructor(commands = []) {
    this.commands = commands;
  }

  schedule = command => {
    this.commands.push(command);
  }

  commandsDue = now => this.commands.filter(cmd => cmd.isDue(now))

  deliverDueCommands = async(now) => {
    let dueCommands = this.commandsDue(now);
    await dueCommands.map(async cmd => await cmd.deliver());
    this.commands = this.commands.filter(cmd => !dueCommands.some(due => due === cmd));
  }

}
