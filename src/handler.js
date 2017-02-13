import uuidV4 from 'uuid/v4';


export const AGGREGATE = Symbol('reference to aggregate class');
export const COMMAND = Symbol('reference to command class');
export const EVENT = Symbol('reference to event class');

export default class Handler {

  constructor(Aggregate, Command, Event) {
    this[AGGREGATE] = Aggregate;
    this[COMMAND] = Command;
    this[EVENT] = Event;
  }

  handle = async (id, command, aggregate) => {
    if (command.validate() && aggregate.validate(command)) {
      return await this.execute(id, command, aggregate);
    }
  }

  handleCreate = async (command) => {
    const id = uuidV4();

    const cmd = new this[COMMAND](command);
    const aggregate = new this[AGGREGATE](id);

    return await this.handle(id, cmd, aggregate);
  }

  handleCommand = async (id, command, aggregate) => {
    const cmd = new this[COMMAND](command);

    return await this.handle(id, cmd, aggregate);
  }

  execute = async (id, command, aggregate) => {
    return new this[EVENT](id, command);
  }

}
