export default class CommandHandler {

  constructor(Command) {
    this.Command = Command;
  }

  handle = async(commandData) => {
    const command = new this.Command(commandData);

    await command.validate();

    let events = await this.execute(command);
    return Array.isArray(events) ? events : [events];
  }

  execute = async(command) => {

  }
}
