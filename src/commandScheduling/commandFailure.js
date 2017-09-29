export default class CommandFailure {
  constructor({ error, command, aggregate, $scheduler }) {
    this.error = error;
    this.command = command;
    this.aggregate = aggregate;
    this.$scheduler = $scheduler || {};
  }

  retry({ due = null, seconds = null }) {
    if (!due) {
      due = new Date();
      due.setSeconds(due.getSeconds() + seconds);
    }
    this.$scheduler.due = due;
  }
  cancel() {
    this.cancelled = true;
  }
}
