export const CACHE = Symbol('data cache for local processing');


export class Aggregate {

  constructor(id, data) {
    this[CACHE] = { id, sequence: -1 };

    this.setCache(data);
  }

  /*
   * getters/setters
   */
  setCache(data) {
    this[CACHE] = this.apply(this.sanitize(data));
  }

  getCache() {
    return this[CACHE];
  }

  applyEvent(data) {
    this[CACHE].sequence++;

    return this.apply(this.sanitize(data));
  }

  /*
   * utility methods
   */
  apply(data) {
    return {
      ...this[CACHE],
      ...data
    };
  }

  sanitize(data) {
    if (data.name) delete data.name;
    if (data.type) delete data.type;

    return data;
  }

  validate() {
    return true;
  }

}
