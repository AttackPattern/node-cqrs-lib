import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);

import ScheduledCommand from '../src/commandScheduling/scheduledCommand.js';

describe('Scheduled Command', () => {
  it('should be constructable', async() => {
    let command = new ScheduledCommand();
  });

  it('should be due when past ')
});

