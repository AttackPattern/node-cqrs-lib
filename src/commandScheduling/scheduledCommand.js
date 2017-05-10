export default class ScheduledCommand {

  constructor({ service, target, command, due, clock, deliverer }) {
    this.service = service;
    this.target = target;
    this.command = command;
    this.due = due;
    this.clock = clock;
    this.deliverer = deliverer;
  }

  isDue = () => this.due <= this.clock.now();

  deliver = async() => {
    this.deliverer.deliver({ service: this.service, target: this.target, command: this.command });
  };
}
