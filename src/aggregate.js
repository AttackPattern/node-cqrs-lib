function sanitize(data) {
  let { id, name, type, aggregateId, aggregate, timestamp, actor, ...cleanData } = data;
  return cleanData;
}

export default class Aggregate {

  constructor(id, events = []) {
    this.id = id;
    this.version = 0;
    this.applyEvents(events);
  }

  applyEvents(events) {
    return events.map(e => {
      if (e.sequenceNumber && e.sequenceNumber <= this.version) {
        throw new Error('Event came out of sequence');
      }
      this.applyEvent(e);

      e.sequenceNumber = e.sequenceNumber || this.version + 1;
      e.aggregateId = e.aggregateId || this.id;

      this.version = e.sequenceNumber;
      return e;
    });
  }

  // TODO: Need a singular version of applyEvent, name the overrideable something different
  // Probably update()
  applyEvent(event) {
    this.applyData(event);
  }

  // TODO: Too much event data shouldn't be just applied directly to the aggregate. Remove this.
  applyData(data) {
    Object.assign(this, sanitize(data));
  }

  validate() {
    return true;
  }
}
