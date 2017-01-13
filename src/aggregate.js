export default class Aggregate {

  constructor(id) {
    this.cache = {
      id,
      sequence: 0
    };
  }

  setCache(cache) {
    this.cache = cache;
  }

  applyChange(event) {
    this.cache = {
      ...event,
      id: this.cache.id,
      sequence: ++this.cache.sequence
    };
  }

}
