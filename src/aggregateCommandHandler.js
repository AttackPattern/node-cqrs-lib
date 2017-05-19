export default class AggregateCommandHandler {

  constructor(Command) {
    this.Command = Command;
  }

  handle = async(commandData, aggregate) => {
    const command = new this.Command(commandData);

    await command.validate();
    this.validate(command, aggregate);

    let events = await this.execute(command, aggregate) || [];
    if (!Array.isArray(events)) {
      events = [events];
    }

    return aggregate.applyEvents(events);
  }

  execute = async(command, aggregate) => {

  }

  validate(command, aggregate) { }
}
