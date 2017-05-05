export default class CommandScheduler {

  constructor() {
    this.commands = [];
  }

  schedule = command => {
    this.commands.push(command);
  }

  commandsDue = now => this.commands.filter(cmd => cmd.isDue(now))

  deliverDueCommands = async(now) => {
    let commands = this.commandScheduler.commandsDue(now);
    await commands.map(async cmd => await cmd.deliver());
  }

}
