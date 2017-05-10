export default class ScheduledCommand {

  constructor(target, command, due, clock, deliverer) {
    this.target = target;
    this.command = command;
    this.due = due;
    this.clock = clock;
    this.deliverer = deliverer;
  }

  isDue = () => this.due <= this.clock.now();

  deliver = async() => this.deliverer.deliver(this.target, this.command);
}
