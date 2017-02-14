export const CACHE = Symbol('data cache for local processing');

/*
 * NOTE: this is a Pseudo-classical Decorator implementation. It requires an Entity
 *        to still be defined and get/set to be modified to take the data in CACHE
 *        to instantiate/validate against the Entity respectively.
 *        https://addyosmani.com/resources/essentialjsdesignpatterns/book/#decoratorpatternjavascript
 */
export default class Aggregate {

  constructor(id, data) {
    this[CACHE] = { id, sequence: -1 };

    if (data) this.setCache(data);
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
