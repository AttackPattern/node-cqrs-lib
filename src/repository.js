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
      throw new Error(`Aggregate ${aggregateId} not found`);
    }
    return new this.Ctor(aggregateId, events);
  }

  create = () => new this.Ctor(uuidV4());

  record = async events => {
    let store = await this.getStore();
    await events.forEach(async event => {
      let recordedEvent = await store.recordEvent(event);
      await this.notifySubscribers(recordedEvent);
    });
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
