export default class CommandScheduler {

  constructor(getStore) {
    this.getStore = getStore;
  }

  schedule = async command => {
    let store = await this.getStore();
    store.push(command);
  }

  commandsDue = async now => {
    let commands = await (await this.getStore()).commands();
    return commands.filter(cmd => cmd.isDue(now));
  }

  deliverDueCommands = async(now) => {
    let dueCommands = await this.commandsDue(now);
    await dueCommands.map(async cmd => await cmd.deliver());
    let store = await this.getStore();
    store.complete(dueCommands);
  }

}
