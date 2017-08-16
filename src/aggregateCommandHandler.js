export default class AggregateCommandHandler {

  constructor(Command) {
    this.Command = Command;
  }

  handle = async(commandData, aggregate) => {
    const command = new this.Command(commandData);

    await command.validate();
    await this.authorize(command, aggregate);
    await this.validate(command, aggregate);

    let events = asArray(await this.execute(command, aggregate));

    events.forEach(event => {
      event.actor = command.$identity && command.$identity.userId;
      event.position = command.$position;
    });

    return aggregate.applyEvents(events);
  }

  execute = async(command, aggregate) => {

  }

  authorize = async(command, aggregate) => {
    return true;
  }

  validate(command, aggregate) {}

  handleDeliveryError = async(failure) => {
    console.log('delivery failure', failure);
    failure.cancel();
  }
}

function asArray(events = []) {
  return Array.isArray(events) ? events : [events];
}
