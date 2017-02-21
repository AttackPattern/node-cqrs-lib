export default class Aggregate {

  constructor(id, data) {
    this.id = id;
    Object.assign(this, data);
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
    return {
      name: undefined,
      type: undefined,
      ...data
    }
  }

  validate() {
    return true;
  }
}
