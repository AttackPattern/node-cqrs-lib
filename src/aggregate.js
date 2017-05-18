export default class Aggregate {

  constructor(id, events = []) {
    this.id = id;
    this.version = 0;
    this.applyEvents(events);
  }

  applyEvents(events) {
    // Accept one or an array of events
    return (Array.isArray(events) ? events : [events]).map(e => {
      if (e.sequenceNumber && e.sequenceNumber <= this.version) {
        throw new Error('Event came out of sequence');
      }
      e.update(this);

      e.sequenceNumber = e.sequenceNumber || this.version + 1;
      e.aggregateId = e.aggregateId || this.id;

      this.version = e.sequenceNumber;
      return e;
    });
  }

  validate() {
    return true;
  }
}
