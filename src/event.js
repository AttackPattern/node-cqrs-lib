import Message from './message';

export default class Event extends Message {
  type = 'event';

  constructor(id, data) {
    super({ ...data, id });

    this.sequence = data.sequence;
    this.timestamp = new Date().toISOString();
  }

}
