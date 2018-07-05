export default class CommandHandlerError {
  constructor({ error, message, handler, aggregate }) {
    this.error = error;
    this.message = message;
    this.handler = handler;
    this.aggregate = aggregate;
  }
}
