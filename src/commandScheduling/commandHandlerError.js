export default class CommandHandlerError {
  constructor({ error, handler, aggregate }) {
    this.error = error;
    this.handler = handler;
    this.aggregate = aggregate;
  }
}
