export default class CommandScheduleTrigger {
  constructor(commandScheduler, clock, interval) {
    this.commandScheduler = commandScheduler;
    this.clock = clock;
    this.interval = interval;
  }

  start = () => setTimeout(this.onTick, this.interval);

  onTick = async () => {
    await this.commandScheduler.deliverDueCommands(this.clock.now());
    setTimeout(this.onTick, this.interval);
  }
}
