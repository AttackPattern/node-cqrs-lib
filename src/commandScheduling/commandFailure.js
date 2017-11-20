export default class CommandFailure {
  constructor({ error, command, aggregate }) {
    this.error = error;
    this.command = command;
    this.aggregate = aggregate;
  }

  retry({ due = null, seconds = null }) {
    if (!due) {
      due = new Date();
      due.setSeconds(due.getSeconds() + seconds);
    }
    this.command.$scheduler.due = due;
  }
  cancel() {
    this.cancelled = true;
  }
}
