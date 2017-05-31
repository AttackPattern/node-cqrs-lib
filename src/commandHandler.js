export default class CommandHandler {

  constructor(Command) {
    this.Command = Command;
  }

  handle = async(commandData) => {
    const command = new this.Command(commandData);

    await command.validate();

    let events = asArray(await this.execute(command));

    events.forEach(event => {
      event.actor = command.$identity && command.$identity.userId;
      event.position = command.$position;
    });
    return events;
  }

  execute = async(command) => {

  }
}

function asArray(events = []) {
  return Array.isArray(events) ? events : [events];
}
