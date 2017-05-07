export default class CommandHandler {

  constructor(Command) {
    this.Command = Command;
  }

  handle = async(commandData) => {
    const command = new this.Command(commandData);

    await command.validate();

    return await this.execute(command);
  }

  execute = async(command) => {

  }
}
