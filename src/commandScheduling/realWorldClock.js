import Clock from './clock';

export default class RealWorldClock extends Clock {
  now = () => new Date()
}
