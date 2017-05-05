import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);

import VirtualClock from './virtualClock.js';
import CommandScheduler from '../src/commandScheduling/commandScheduler';
import ScheduledCommand from '../src/commandScheduling/scheduledCommand';

describe('Command Scheduler', () => {
  it('should accept newly scheduled commands', () => {
    let scheduler = new CommandScheduler();
    let command = new ScheduledCommand(null, new Date(0), new VirtualClock());
    scheduler.schedule(command);
    expect(scheduler.commands).to.contain(command);
  });

  describe('commandsDue', () => {
    it('should not prematurely return command before they are due', () => {
      let scheduler = new CommandScheduler();
      let command = new ScheduledCommand(null, new Date('5/2/2017'), new VirtualClock('5/1/2017'));
      scheduler.schedule(command);

      expect(scheduler.commandsDue(new Date())).to.not.contain(command);
    });

    it('should return due command', () => {
      let scheduler = new CommandScheduler();
      let command = new ScheduledCommand(null, new Date('5/1/2017'), new VirtualClock('5/2/2017'));
      scheduler.schedule(command);

      expect(scheduler.commandsDue()).to.contain(command);
    });
  });

  describe('deliverDueCommands', () => {
    it('should not prematurely deliver commands before they are due', async () => {
      let scheduler = new CommandScheduler();
      let delivered = false;
      let command = new ScheduledCommand(null, new Date('5/2/2017'), new VirtualClock('5/1/2017'), { deliver: () => delivered = true });
      scheduler.schedule(command);

      await scheduler.deliverDueCommands();
      expect(delivered).to.be.false;
    });
    it('should deliver due commands', async () => {
      let scheduler = new CommandScheduler();
      let delivered = false;
      let command = new ScheduledCommand(null, new Date('5/1/2017'), new VirtualClock('5/2/2017'), { deliver: () => delivered = true });
      scheduler.schedule(command);

      await scheduler.deliverDueCommands();
      expect(delivered).to.be.true;
    });
  });
});
