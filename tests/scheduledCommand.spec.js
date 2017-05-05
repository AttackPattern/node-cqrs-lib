import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);

import VirtualClock from './virtualClock.js';
import ScheduledCommand from '../src/commandScheduling/scheduledCommand';

describe('Scheduled Command', () => {
  it('should be due when past clock time', () => {
    let command = new ScheduledCommand(null, new Date('5/1/2017'), new VirtualClock('5/2/2017'));
    expect(command.isDue()).is.true;
  });
});

