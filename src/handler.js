export const COMMAND = Symbol('reference to command class');
export const EVENT = Symbol('reference to event class');

export default class Handler {

  constructor(Command, Event) {
    this[COMMAND] = Command;
    this[EVENT] = Event;
  }

  handle = async (id, commandData, aggregate) => {
    const command = new this[COMMAND](commandData);

    await command.validate();
    aggregate.validate(command);

    return await this.execute(id, command, aggregate);
  }

  execute = async (id, command, aggregate) => {
    return new this[EVENT](id, command);
  }
}
