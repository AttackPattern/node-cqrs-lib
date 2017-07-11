import uuidV4 from 'uuid/v4';

export default class Repository {

  constructor(getStore, Ctor) {
    this.getStore = getStore;
    this.Ctor = Ctor;
    this.subscriptions = [];
  }

  get = async(aggregateId) => {
    let events = await (await this.getStore()).getEvents(aggregateId);
    if (!events.length) {
      return null;
    }
    return new this.Ctor(aggregateId, events);
  }

  create = id => new this.Ctor(id || uuidV4());

  record = async events => {
    let store = await this.getStore();
    let recordedEvents = await store.record(events);
    await this.notifySubscribers(recordedEvents);
  }

  notifySubscribers = async(events) => {
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

  getEvents = async (aggregateId) => {
    return await (await this.getStore()).getEvents(aggregateId);
  }
}
