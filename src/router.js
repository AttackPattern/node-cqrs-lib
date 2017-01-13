import Router from 'koa-router';

export default class MessageRouter extends Router {

  constructor(handlers) {
    super();

    this.handlers = handlers;

    this
      .post('/:commandName', this.postCreate)
      .post('/:aggregateId/:commandName', this.postCommand);
  }

  postCreate = async (ctx, next) => {
    const name = ctx.params.commandName;
    const data = ctx.request.body;

    try {
      const id = await this.handlers[name].execute(data);

      ctx.status = 200;
      return ctx.body = id;
    }
    catch (e) {
      return next();
    }
  }

  postCommand = async (ctx, next) => {
    const aggregateId = ctx.params.aggregateId;
    const name = ctx.params.commandName;
    const data = ctx.request.body;

    try {
      const id = await this.handlers[name].execute(aggregateId, data);

      ctx.status = 200;
      return ctx.body = id;
    }
    catch (e) {
      return next();
    }
  }

}
