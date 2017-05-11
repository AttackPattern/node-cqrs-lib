import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);

import VirtualClock from '../testSupport/virtualClock.js';
import ScheduledCommand from '../src/commandScheduling/scheduledCommand';

describe('Scheduled Command', () => {
  it('should be due when past clock time', () => {
    let command = new ScheduledCommand({ due: new Date('5/1/2017'), clock: new VirtualClock('5/2/2017') });
    expect(command.isDue()).is.true;
  });

  it('should not be due when before clock time', () => {
    let command = new ScheduledCommand({ due: new Date('5/2/2017'), clock: new VirtualClock('5/1/2017') });
    expect(command.isDue()).is.false;
  });
});
