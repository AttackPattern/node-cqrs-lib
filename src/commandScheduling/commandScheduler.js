export default class CommandScheduler {

  constructor(commands = []) {
    this.commands = commands;
  }

  schedule = command => {
    this.commands.push(command);
  }

  commandsDue = now => this.commands.filter(cmd => cmd.isDue(now))

  deliverDueCommands = async(now) => {
    let commands = this.commandsDue(now);
    await commands.map(async cmd => await cmd.deliver());
  }

}
