import uuidV4 from 'uuid/V4';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);

import VirtualClock from '../testSupport/virtualClock.js';
import Command from '../src/command';
import CommandScheduler from '../src/commandScheduling/commandScheduler';
import ScheduledCommand from '../src/commandScheduling/scheduledCommand';
import CommandHandlerError from '../src/commandScheduling/commandHandlerError';

describe('Command Scheduler', () => {
  it('should accept newly scheduled commands', async() => {
    let store = new TestStore();
    let scheduler = new CommandScheduler({ store });
    let command = new TestCommand();
    scheduler.schedule({ command: command });
    expect((await store.commands()).map(c => c.command.id)).to.contain(command.id);
  });

  describe('commandsDue', async() => {
    it('should not prematurely return command before they are due', async() => {
      let scheduler = new CommandScheduler({
        store: new TestStore(),
        clock: new VirtualClock('5/1/2017')
      });
      let command = new TestCommand();
      scheduler.schedule({ command, due: new Date('5/2/2017') });

      expect((await scheduler.commandsDue(new Date())).map(c => c.command)).to.not.contain(command);
    });

    it('should return due command', async() => {
      let scheduler = new CommandScheduler({
        store: new TestStore(),
        clock: new VirtualClock('5/2/2017')
      });
      let command = new TestCommand();
      scheduler.schedule({ command: command, due: new Date('5/1/2017') });

      expect((await scheduler.commandsDue()).map(c => c.command.id)).to.contain(command.id);
    });
  });

  describe('deliverDueCommands', async() => {
    it('should not prematurely deliver commands before they are due', async() => {
      let scheduler = new CommandScheduler({
        store: new TestStore(),
        clock: new VirtualClock('5/1/2017'),
        deliverer: { deliver: () => delivered = true }
      });
      let delivered = false;
      let command = new ScheduledCommand({ command: new TestCommand(), due: new Date('5/2/2017') });
      scheduler.schedule(command);

      await scheduler.deliverDueCommands();
      expect(delivered).to.be.false;
      expect(await scheduler.commandsDue()).to.not.contain(command);
    });

    it('should deliver due commands', async() => {
      let scheduler = new CommandScheduler({
        store: new TestStore(),
        clock: new VirtualClock('5/2/2017'),
        deliverer: { deliver: () => delivered = true }
      });
      let delivered = false;
      scheduler.schedule({ command: new TestCommand(), due: new Date('5/1/2017') });

      await scheduler.deliverDueCommands();
      expect(delivered).to.be.true;
    });

    it('should remove commands from store after delivery', async() => {
      let store = new TestStore();
      let scheduler = new CommandScheduler({
        store,
        clock: new VirtualClock('5/2/2017'),
        deliverer: { deliver: () => {} }
      });

      let command = new TestCommand();
      scheduler.schedule({ command: new TestCommand() });

      await scheduler.deliverDueCommands();
      expect((await store.commands()).map(c => c.command)).to.not.contain(command);
    });
  });

  describe('identity', async() => {
    it('should set command identity to system', async() => {
      let store = new TestStore();
      let scheduler = new CommandScheduler({ store });
      let command = new TestCommand();
      scheduler.schedule({ command: command });
      expect((await store.commands())[0].command.$identity.isSystem()).to.be.true;
    });
  });
  describe('failure handling', async() => {
    it('should call delivery fail handler if handler throws an error', async() => {
      let handler = new TestHandler();
      let scheduler = new CommandScheduler({
        store: new TestStore(),
        clock: new VirtualClock('5/2/2017'),
        deliverer: {
          deliver: ({ command }) => {
            throw new CommandHandlerError({ handler, command });
          }
        }
      });

      scheduler.schedule({ command: new TestCommand(), due: new Date('5/1/2017') });
      await scheduler.deliverDueCommands();

      expect(handler.failureHandled).to.be.true;
    });
  });
});

class TestCommand extends Command {
  constructor(data = {}) {
    super(data);
    this.id = data.id || uuidV4();
  }
}

class TestStore {
  storedCommands = []

  commands = async() => this.storedCommands

  push = async cmd => this.storedCommands.push(cmd);

  complete = async(commands) => this.storedCommands = (await this.commands()).filter(cmd => !commands.some(due => due === cmd));
}

class TestHandler {
  handleDeliveryError = async(command, aggregate) => {
    this.failureHandled = true;
  }
}
