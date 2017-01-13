import Message from './message';

export default class Command extends Message {
  type = 'command';

  constructor(data) {
    super(data);
  }

  validate = async function () { return true; }

}
