export default class CommandScheduleTrigger {
  constructor(commandScheduler, clock, interval) {
    this.commandScheduler = commandScheduler;
    this.clock = clock;
    this.interval = interval;

    const scheduleMethod = this.commandScheduler.schedule.bind(this);

    this.commandScheduler.schedule = async (...args) => {
      await scheduleMethod(...args);
      clearTimeout(this.nextTimeout);
      this.nextTimeout = setTimeout(() => this.onTick(), 0);
    };
  }

  start = () => setTimeout(this.onTick, 0);

  onTick = async () => {
    clearTimeout(this.nextTimeout);
    await this.commandScheduler.deliverDueCommands(this.clock.now());
    this.nextTimeout = setTimeout(this.onTick, this.interval);
  }
}
