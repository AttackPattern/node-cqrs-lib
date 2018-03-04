import uuidV4 from 'uuid/V4';
import chai, { expect } from 'chai';
chai.use(require('chai-as-promised'));
chai.use(require('chai-datetime'));

import VirtualClock from '../testSupport/virtualClock.js';
import Command from '../src/command';
import CommandScheduler from '../src/commandScheduling/commandScheduler';
import CommandHandlerError from '../src/commandScheduling/commandHandlerError';

describe('Command Scheduler', () => {
  // TODO (brett) - Rewrite these tests
  return;
  it('should accept newly scheduled commands', async () => {
    let store = new TestStore();
    let scheduler = new CommandScheduler({ store });
    let command = new TestCommand();
    scheduler.schedule({ command: command });
    expect((await store.commands()).map(c => c.id)).to.contain(command.id);
  });

  describe('commandsDue', async () => {
    it('should not prematurely return command before they are due', async () => {
      let scheduler = new CommandScheduler({
        store: new TestStore(),
        clock: new VirtualClock('5/1/2017')
      });
      let command = new TestCommand();
      scheduler.schedule({ command, due: new Date('5/2/2017') });

      expect((await scheduler.commandsDue(new Date())).map(c => c.command)).to.not.contain(command);
    });

    it('should return due command', async () => {
      let scheduler = new CommandScheduler({
        store: new TestStore(),
        clock: new VirtualClock('5/2/2017')
      });
      let command = new TestCommand();
      scheduler.schedule({ command: command, due: new Date('5/1/2017') });

      expect((await scheduler.commandsDue()).map(c => c.id)).to.contain(command.id);
    });
  });

  describe('deliverDueCommands', async () => {
    it('should not prematurely deliver commands before they are due', async () => {
      let scheduler = new CommandScheduler({
        store: new TestStore(),
        clock: new VirtualClock('5/1/2017'),
        deliverer: { deliver: () => delivered = true }
      });
      let delivered = false;
      const command = new TestCommand();
      scheduler.schedule({ command, due: new Date('5/2/2017') });

      await scheduler.deliverDueCommands();
      expect(delivered).to.be.false;
      expect(await scheduler.commandsDue()).to.not.contain(command);
    });

    it('should deliver due commands', async () => {
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

    it('should remove commands from store after delivery', async () => {
      let store = new TestStore();
      let scheduler = new CommandScheduler({
        store,
        clock: new VirtualClock('5/2/2017'),
        deliverer: { deliver: () => { } }
      });

      let command = new TestCommand();
      scheduler.schedule({ command: new TestCommand() });

      await scheduler.deliverDueCommands();
      expect(await store.commands()).to.not.contain(command);
    });

    it('should reschedule a retried command', async () => {
      let store = new TestStore();
      let scheduler = new CommandScheduler({
        store,
        clock: new VirtualClock('5/2/2017'),
        deliverer: {
          deliver: ({ command }) => command.retry({ due: new Date('5/3/2017') })
        }
      });

      scheduler.schedule({ command: new TestCommand(), due: new Date('5/1/2017') });

      await scheduler.deliverDueCommands();
      expect(store.allCommands[0].$scheduler.due).to.equalDate(new Date('5/3/2017'));
    });
  });

  describe('identity', async () => {
    it('should set command identity to system', async () => {
      let store = new TestStore();
      let scheduler = new CommandScheduler({ store });
      let command = new TestCommand();
      scheduler.schedule({ command });
      expect((await store.commands())[0].$identity.isSystem()).to.be.true;
    });
  });
  describe('failure handling', async () => {
    it('should call delivery fail handler if handler throws an error', async () => {
      let failureHandled = false;
      let handler = new TestHandler({ onDeliveryError: () => failureHandled = true });
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

      expect(failureHandled).to.be.true;
    });

    it('should complete command if delivery handler cancels', async () => {
      let handler = new TestHandler({ onDeliveryError: failure => failure.cancel() });
      let store = new TestStore();
      let scheduler = new CommandScheduler({
        store: store,
        clock: new VirtualClock('5/2/2017'),
        deliverer: {
          deliver: ({ command }) => {
            throw new CommandHandlerError({ handler, command });
          }
        }
      });

      scheduler.schedule({ command: new TestCommand(), due: new Date('5/1/2017') });
      await scheduler.deliverDueCommands();

      expect(store.allCommands[0].complete).to.be.true;
    });

    it('should retry command if delivery failure handler retries', async () => {
      let handler = new TestHandler({ onDeliveryError: failure => failure.retry({ due: new Date('5/3/2017') }) });
      let store = new TestStore();
      let scheduler = new CommandScheduler({
        store: store,
        clock: new VirtualClock('5/2/2017'),
        deliverer: {
          deliver: ({ command }) => {
            throw new CommandHandlerError({ handler, command });
          }
        }
      });

      scheduler.schedule({ command: new TestCommand(), due: new Date('5/1/2017') });
      await scheduler.deliverDueCommands();

      expect(store.allCommands[0].$scheduler.due).to.equalDate(new Date('5/3/2017'));
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
  allCommands = []

  commands = async () => this.allCommands.filter(cmd => !cmd.complete && !cmd.cancelled)

  push = async cmd => this.allCommands.push(cmd)

  retry = () => { }
  complete = async command => command.complete = true
}

class TestHandler {
  constructor({ onDeliveryError }) {
    this.handleDeliveryError = onDeliveryError;
  }
}
