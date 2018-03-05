import uuidV4 from 'uuid/v4';

export default class Repository {

  constructor({ eventStore, aggregate, snapshots = true }) {
    this.eventStore = eventStore;
    this.Ctor = aggregate;
    this.snapshots = snapshots;
    this.subscriptions = [];
  }

  get = async aggregateId => {
    let { events, snapshot } = await this.eventStore.getEvents(aggregateId);
    if (!snapshot && !events.length) {
      return null;
    }
    let aggregate = new this.Ctor({
      id: aggregateId,
      events,
      snapshot: snapshot?.body,
      version: snapshot?.version
    });

    if (this.snapshots && (aggregate.$snapshotSchedule?.every || Number.MAX_VALUE) <= events.length) {
      await this.eventStore.saveSnapshot(aggregate);
    }

    return aggregate;
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
