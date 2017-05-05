export default class CommandScheduleTrigger {
  constructor(commandScheduler, clock) {
    this.commandScheduler = commandScheduler;
    this.clock = clock;
  }

  onTick = async () => {
    await this.commandScheduler.deliverDueCommands(this.clock.now());
    setTimeout(this.onTick, 1000);
  }
}
