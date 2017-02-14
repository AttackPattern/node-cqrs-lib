import { ValidationError } from 'node-cqrs-lib';

export const COMMAND = Symbol('reference to command class');
export const EVENT = Symbol('reference to event class');

export default class Handler {

  constructor(Command, Event) {
    this[COMMAND] = Command;
    this[EVENT] = Event;
  }

  handle = async (id, commandData, aggregate) => {
    const command = new this[COMMAND](commandData);

    try {
      if (command.validate() && aggregate.validate(command)) {
        return await this.execute(id, command, aggregate);
      }
    }
    catch (e) {
      console.dir(e);
      if (e instanceof ValidationError) {
        console.log('validation failure');
        console.dir(e);
      }
      throw e;
    }
    return null;
  }

  execute = async (id, command, aggregate) => {
    return new this[EVENT](id, command);
  }
}
