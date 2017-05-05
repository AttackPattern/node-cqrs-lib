export default class ScheduledCommand {

  constructor(command, due, clock, deliverer) {
    this.command = command;
    this.due = due;
    this.clock = clock;
    this.deliverer = deliverer;
  }

  isDue = () => this.due <= this.clock.now();

  deliver = async() => this.deliverer.deliver(this.command);
}
