import uuidV4 from 'uuid/v4';

export default class Repository {

  constructor({ eventStore, aggregate }) {
    this.eventStore = eventStore;
    this.Ctor = aggregate;
    this.subscriptions = [];
  }

  get = async aggregateId => {
    let events = await this.eventStore.getEvents(aggregateId);
    if (!events.length) {
      return null;
    }
    return new this.Ctor({ id: aggregateId, events });
  }

  create = id => new this.Ctor({ id: id || uuidV4() });

  record = async events => {
    let recordedEvents = await this.eventStore.record(events);
    await this.notifySubscribers(recordedEvents);
  }

  notifySubscribers = async events => {
    return await Promise.all(this.subscriptions.map(async s => {
      try {
        return await s(events);
      }
      catch (err) {
        console.log(err);
      }
    }));
  }

  subscribe(subscription) {
    this.subscriptions.push(subscription);
  }

  getEvents = async aggregateId => {
    return await this.eventStore.getEvents(aggregateId);
  }
}
