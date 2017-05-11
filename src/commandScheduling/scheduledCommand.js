export default class ScheduledCommand {

  constructor({ service, target, command, due, clock }) {
    this.service = service;
    this.target = target;
    this.command = command;
    this.due = due;
    this.clock = clock;
  }

  isDue = () => this.due <= this.clock.now();
}
