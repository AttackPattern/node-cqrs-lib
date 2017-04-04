export default class Aggregate {

  constructor(id, events = []) {
    this.id = id;
    this.version = 0;
    this.applyEvents(events);
  }

  applyEvents(events) {
    events.reduce(e => {
      this.version++;
      return this.applyEvent(e);
    }, this);
  }

  applyEvent(event) {
    return this.applyData(event);
  }

  applyData(data) {
    return Object.assign(this, this.sanitize(data));
  }

  sanitize(data) {
    let { name, type, ...cleanData } = data;
    return cleanData;
  }

  validate() {
    return true;
  }
}
