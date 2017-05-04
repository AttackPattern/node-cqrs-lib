export default class ScheduledCommand {

  constructor(command, target, clock) {
    this.command = command;
    this.target = target;
    this.clock = clock;
  }

}
