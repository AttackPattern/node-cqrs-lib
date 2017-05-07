export default class Container {
  constructor() {
    this.registrations = {};
  }

  register = (Target, factory) => {
    this.registrations[Target] = factory;
  }

  resolve = Target => {
    if (this.registrations[Target]) {
      return this.registrations[Target]();
    }

    let args = (Target.__ctorArgs || []).map(arg => this.resolve(arg));
    return new Target(...args);
  }
}

export function inject(args) {
  return (Target, property, description) => {
    Target.__ctorArgs = args;
  };
}
