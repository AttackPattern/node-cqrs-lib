function sanitize(data) {
  let { name, type, ...cleanData } = data;
  return cleanData;
}

export default class Aggregate {

  constructor(id, events = []) {
    this.id = id;
    this.version = 0;
    this.applyEvents(events);
  }

  applyEvents(events) {
    events.forEach(e => {
      if (e.sequenceNumber <= this.version) {
        throw new Error('Event came out of sequence');
      }
      this.applyEvent(e);
      this.version = e.sequenceNumber;
    }, this);
  }

  applyEvent(event) {
    this.applyData(event);
  }

  applyData(data) {
    Object.assign(this, sanitize(data));
  }

  validate() {
    return true;
  }
}
