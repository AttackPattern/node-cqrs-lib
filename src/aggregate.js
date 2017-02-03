const CACHE = Symbol('data cache for local processing');

export default class Aggregate {

  constructor(id, data) {
    this[CACHE] = { id, sequence: 0 };

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
    return this.apply(this.sanitize(data));
  }

  /*
   * utility methods
   */
  apply(data) {
    return {
      ...this[CACHE],
      ...data,
      sequence: ++this[CACHE].sequence
    };
  }

  sanitize(data) {
    if (data.name) delete data.name;
    if (data.type) delete data.type;

    return data;
  }

}
