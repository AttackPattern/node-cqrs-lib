export default class Aggregate {

  constructor(id, events = []) {
    this.id = id;

    this.applyEvents(events);
  }

  applyEvents(events) {
    Array.reduce(events, e => {
      this.version++;
      return this.applyEvent(e);
    }, this);
  }

  getCache() {
    return this;
  }

  applyEvent(event) {
    return this.applyData(event);
  }

  applyData(data) {
    return Object.assign(this, this.sanitize(data));
  }

  sanitize(data) {
    let cleanData = { ...data };
    delete cleanData['name'];
    delete cleanData['type'];
    return cleanData;
  }

  validate() {
    return true;
  }
}
