import ValidationError from '../validationError';

export default class AggregateCommandHandler {

  constructor(Command) {
    this.Command = Command;
  }

  handle = async (commandData, aggregate) => {
    const command = new this.Command(commandData);

    await command.validate();
    await this.authorize(command, aggregate);
    await this.validate(command, aggregate);

    const result = await this.execute(command, aggregate);
    commandData.$scheduler = command.$scheduler;

    let { events, ...body } = result || {};

    if (!events) {
      events = result;
      body = null;
    }

    events = asArray(events);
    events.forEach(event => {
      event.actor = command.$identity && command.$identity.userId;
      event.position = command.$position;
    });
    events = aggregate.applyEvents(events);

    return { events, ...body };
  }

  execute = async (command, aggregate) => {

  }

  authorize = async (command, aggregate) => {
    return true;
  }

  validate(command, aggregate) { }

  handleDeliveryError = async (failure) => {
    if (!(failure.error instanceof ValidationError)) {
      failure.retry();
    }
    else {
      failure.cancel();
    }
  }
}

function asArray(events = []) {
  return (Array.isArray(events) ? events : [events]).filter(e => !!e);
}
