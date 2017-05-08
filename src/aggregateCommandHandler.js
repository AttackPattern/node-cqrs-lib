export default class AggregateCommandHandler {

  constructor(Command) {
    this.Command = Command;
  }

  handle = async(commandData, aggregate) => {
    const command = new this.Command(commandData);

    await command.validate();
    // if (command.version != aggregate.version) {
    //   throw new ValidationError(aggregate, command, "Command being issued against incorrect version of aggregate");
    // }
    aggregate.validate(command);

    let events = await this.execute(command, aggregate) || [];
    if (!Array.isArray(events)) {
      events = [events];
    }

    return aggregate.applyEvents(events);
  }

  execute = async(command, aggregate) => {

  }
}
