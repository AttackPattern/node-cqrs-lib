export default class CommandHandler {

  constructor(Command) {
    this.Command = Command;
  }

  handle = async (commandData) => {
    const command = new this.Command(commandData);

    await command.validate();
    await this.authorize(command);

    const result = asArray(await this.execute(command));

    let { events, ...body } = result;

    if (!events) {
      events = result;
      body = null;
    }

    events = asArray(events);
    events.forEach(event => {
      event.actor = command.$identity && command.$identity.userId;
      event.position = command.$position;
    });

    return { events, ...body };
  }

  execute = async command => { }

  authorize = async command => {
    return true;
  }

  handleDeliveryError = async failure => { }
}

function asArray(events = []) {
  return Array.isArray(events) ? events : [events];
}
