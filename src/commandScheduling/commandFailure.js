export default class CommandFailure {
  constructor({ command, timesAttempted }) {
    this.command = command;
    this.timesAttempted = timesAttempted;
  }

  retry(due = null) {
    this.nextRetry = due || new Date();
  }
  cancel() {
    this.cancelled = true;
  }
}
