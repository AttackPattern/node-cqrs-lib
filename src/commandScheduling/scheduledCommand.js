export default class ScheduledCommand {

  constructor({ id, service, target, command, due, attempts, clock }) {
    this.id = id;
    this.service = service;
    this.target = target;
    this.command = command;
    this.due = due;
    this.attempts = attempts;
    this.clock = clock;
  }

  isDue = () => this.due <= this.clock.now();
}
