export default class ScheduledCommand {

  constructor(command, clock, deliverer) {
    this.command = command;
    this.clock = clock;
    this.deliverer = deliverer;
  }

  isDue = now => now >= this.clock.now();

  deliver = async () => this.deliverer.deliver(this);
}
