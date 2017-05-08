export const COMMAND = Symbol('reference to command class');
export const EVENT = Symbol('reference to event class');

import AggregateCommandHandler from './aggregateCommandHandler';

export default class EasyCommandHandler extends AggregateCommandHandler {
  constructor(Command, Event) {
    super(Command);
    this[EVENT] = Event;
  }

  execute = async(command) => new this[EVENT]({
      ...command
    });
}

export function factory(Command, Event) {
  return () => new EasyCommandHandler(Command, Event);
}
