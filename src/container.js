export default class Container {
  constructor() {
    this.registrations = {};
  }

  register = (Target, factory) => {
    if (typeof factory !== 'function') {
      throw new Error(`Container registration '${Target}' was not a function`);
    }

    this.registrations[Target] = factory;
  }

  resolve = Target => {
    if (this.registrations[Target]) {
      return this.registrations[Target]();
    }

    if (!(Target instanceof constructor)) {
      throw new Error(`Registration not found: "${Target}"`);
    }

    let args = (Target.__ctorArgs || []).map(arg => this.resolve(arg));
    return new Target(...args);
  }
}

export function inject(...args) {
  return (Target, property, description) => {
    Target.__ctorArgs = args;
  };
}
