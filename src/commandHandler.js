export const COMMAND = Symbol('reference to command class');

export default class CommandHandler {

  constructor(Command) {
    this[COMMAND] = Command;
  }

  handle = async(commandData) => {
    const command = new this[COMMAND](commandData);

    await command.validate();

    return await this.execute(command);
  }

  execute = async(command) => {

  }
}
