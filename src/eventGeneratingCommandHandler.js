export const COMMAND = Symbol('reference to command class');
export const EVENT = Symbol('reference to event class');

import CommandHandler from './commandHandler';

export default class EventGeneratingCommandHandler extends CommandHandler {
  constructor(Command, Event) {
    super(Command);
    this[EVENT] = Event;
  }

  execute = async(command, aggregate) => {
    return new this[EVENT]({
      aggregateId: aggregate.id,
      sequenceNumber: aggregate.version + 1,
      ...command
    });
  }
}
