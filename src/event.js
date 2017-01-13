import Message from './message';

export default class Event extends Message {
  type = 'event';

  constructor(data) {
    super(data);
  }

}
