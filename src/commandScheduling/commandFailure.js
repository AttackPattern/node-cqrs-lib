export class Cancel {
}

export class Retry {
}

export default class CommandFailure {
  constructor({ error, command, aggregate }) {
    this.error = error;
    this.command = command;
    this.aggregate = aggregate;
  }

  retry() {
    this.failureAction = new Retry();
  }
  cancel() {
    this.failureAction = new Cancel();
  }
}
