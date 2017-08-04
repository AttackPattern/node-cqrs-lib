export default class CommandFailure {
  previousRetryAttempts = 0;
  retry({ due = null }) {
    this.nextRetry = due || new Date();
  }
  cancel() {
    this.cancelled = true;
  }
}
