export default class Event {

  constructor(data = {}) {
    this.aggregate = data.aggregate;
    this.aggregateId = data.aggregateId;
    this.sequenceNumber = data.sequenceNumber;
    this.timestamp = data.timestamp;
    this.actor = data.actor;
    this.position = data.position;
  }

  update(aggregate) {}
}
