export const REPOSITORY = Symbol('reference to repository interface');
export const AGGREGATE = Symbol('reference to aggregate class');
export const COMMAND = Symbol('reference to command class');
export const EVENT = Symbol('reference to event class');


export class Handler {

  constructor(repository, Aggregate, Command, Event) {
    this[REPOSITORY] = repository;
    this[AGGREGATE] = Aggregate;
    this[COMMAND] = Command;
    this[EVENT] = Event;
  }

  handleCommand = async (id, command) => {
    try {
      this[REPOSITORY].watch(id);

      const cmd = new this[COMMAND](command);
      const agg = await this[REPOSITORY].get(id, this[AGGREGATE]);

      agg.validate(cmd);

      await this[REPOSITORY].record(new this[EVENT](id, cmd));

      return id;
    }
    catch (error) {
      this[REPOSITORY].forget(id);

      throw new Error(error);
    }
  }

  handleEvent = async (data) => {
    throw new Error('handleEvent has not been implemented');
  }

}
