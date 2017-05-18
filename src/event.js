export default class Event {

  constructor(data = {}) {
    this.aggregate = data.aggregate;
    this.aggregateId = data.aggregateId;
    this.sequenceNumber = data.sequenceNumber;
    this.timestamp = data.timestamp;
  }

  update(aggregate) {}
}
