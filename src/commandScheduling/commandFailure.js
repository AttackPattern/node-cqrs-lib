export default class CommandFailure {
  constructor({ error, command, aggregate, attempts }) {
    this.error = error;
    this.command = command;
    this.aggregate = aggregate;
    this.attempts = attempts;
  }

  retry({ due = null, seconds = null }) {
    if (!due) {
      due = new Date();
      due.setSeconds(due.getSeconds() + seconds);
    }
    this.nextRetry = due;
  }
  cancel() {
    this.cancelled = true;
  }
}
