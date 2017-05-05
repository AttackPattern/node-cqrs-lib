export default class VirtualClock {
  constructor(now = 0) {
    this.now = () => {
      return new Date(now);
    };
  }

  advance = (now) => this.now = () => now;
}
