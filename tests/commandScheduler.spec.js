import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);

import Command from '../src/command.js';
import CommandScheduler from '../src/commandScheduling/commandScheduler.js';

describe('Command Scheduler', () => {
  it('should be constructable', async() => {
    let scheduler = new CommandScheduler();
  });
});

