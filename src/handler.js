export const COMMAND = Symbol('reference to command class');
export const EVENT = Symbol('reference to event class');

export default class Handler {

  constructor(Command, Event) {
    this[COMMAND] = Command;
    this[EVENT] = Event;
  }

  handle = async(commandData, aggregate) => {
    const command = new this[COMMAND](commandData);

    await command.validate();
    // if (command.version != aggregate.version) {
    //   throw new ValidationError(aggregate, command, "Command being issued against incorrect version of aggregate");
    // }
    aggregate.validate(command);

    return await this.execute(command, aggregate);
  }

  execute = async(command, aggregate) => {
    return new this[EVENT]({
      aggregateId: aggregate.id,
      sequenceNumber: aggregate.version + 1,
      ...command
    });
  }
}
