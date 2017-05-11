import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);

import VirtualClock from '../testSupport/virtualClock.js';
import Command from '../src/command';
import CommandScheduler from '../src/commandScheduling/commandScheduler';
import ScheduledCommand from '../src/commandScheduling/scheduledCommand';

describe('Command Scheduler', () => {
  it('should contain commands supplied on initialization', async() => {
    let store = new TestStore();
    let scheduler = new CommandScheduler(async() => store);
    let command = new ScheduledCommand({ command: new TestCommand(), due: new Date(0), clock: new VirtualClock() });
    scheduler.schedule(command);
    expect(await store.commands()).to.contain(command);
  });

  it('should accept newly scheduled commands', async() => {
    let store = new TestStore();
    let scheduler = new CommandScheduler(async() => store);
    let command = new ScheduledCommand({ command: new TestCommand(), due: new Date(0), clock: new VirtualClock() });
    scheduler.schedule(command);
    expect(await store.commands()).to.contain(command);
  });

  describe('commandsDue', async() => {
    it('should not prematurely return command before they are due', async() => {
      let store = new TestStore();
      let scheduler = new CommandScheduler(async() => store);
      let command = new ScheduledCommand({ command: new TestCommand(), due: new Date('5/2/2017'), clock: new VirtualClock('5/1/2017') });
      scheduler.schedule(command);

      expect(await scheduler.commandsDue(new Date())).to.not.contain(command);
    });

    it('should return due command', async() => {
      let store = new TestStore();
      let scheduler = new CommandScheduler(async() => store);
      let command = new ScheduledCommand({ command: new TestCommand(), due: new Date('5/1/2017'), clock: new VirtualClock('5/2/2017') });
      scheduler.schedule(command);

      expect(await scheduler.commandsDue()).to.contain(command);
    });
  });

  describe('deliverDueCommands', async() => {
    it('should not prematurely deliver commands before they are due', async() => {
      let store = new TestStore();
      let scheduler = new CommandScheduler(async() => store);
      let delivered = false;
      let command = new ScheduledCommand({ command: new TestCommand(), due: new Date('5/2/2017'), clock: new VirtualClock('5/1/2017'), deliverer: { deliver: () => delivered = true } });
      scheduler.schedule(command);

      await scheduler.deliverDueCommands();
      expect(delivered).to.be.false;
      expect(await scheduler.commandsDue()).to.not.contain(command);
    });
    it('should deliver due commands', async() => {
      let store = new TestStore();
      let scheduler = new CommandScheduler(async() => store);
      let delivered = false;
      let command = new ScheduledCommand({ command: new TestCommand(), due: new Date('5/1/2017'), clock: new VirtualClock('5/2/2017'), deliverer: { deliver: () => delivered = true } });
      scheduler.schedule(command);

      await scheduler.deliverDueCommands();
      expect(delivered).to.be.true;
    });

    it('should not contain delivered commands after deliver', async() => {
      let store = new TestStore();
      let scheduler = new CommandScheduler(async() => store);

      let command = new ScheduledCommand({ command: new TestCommand(), due: new Date('5/1/2017'), clock: new VirtualClock('5/2/2017'), deliverer: { deliver: () => {} } });
      scheduler.schedule(command);

      await scheduler.deliverDueCommands();
      expect(await scheduler.commandsDue()).to.not.contain(command);
    });
  });
});

class TestCommand extends Command {}

class TestStore {
  storedCommands = []
  commands = async() => this.storedCommands

  push = async cmd => this.storedCommands.push(cmd);

  complete = async (commands) => this.storedCommands = (await this.commands()).filter(cmd => !commands.some(due => due === cmd));
}
