export default class Schedule {

  constructor({ id, service, target, created, due, clock }) {
    this.id = id;
    this.service = service;
    this.target = target;
    this.created = created;
    this.due = due;
    this.clock = clock;
  }

  isDue = () => this.due <= this.clock.now();
}
