import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);

import Aggregate from '../src/aggregate.js';
import Command from '../src/command.js';
import Event from '../src/event.js';
import CommandHandler from '../src/aggregateCommandHandler.js';
import ValidationError from '../src/validationError.js';

describe('Command Handler', () => {
  it('should throw on a failed command validation', async () => {
    let handler = new CommandHandler(TestCommand_FailValidation);

    await expect(handler.handle({}, new TestAggregate())).to.be.rejectedWith('Failed Validation');
  });

  it('should throw on a failed aggregate validation', async () => {
    let handler = new CommandHandler_FailsValidation(TestCommand);

    await expect(handler.handle({}, new TestAggregate())).to.be.rejectedWith('Failed Aggregate Validation');
  });

  it('should apply events to aggregate', async () => {
    let handler = new CommandHandler(TestCommand);

    let aggregate = new TestAggregate();

    handler = new TestCommandHandler(TestCommand);
    await handler.handle(new TestCommand({ message: 'Successful test' }), aggregate);

    expect(aggregate.lastMessage).to.equal('Successful test');

  });
});

class TestCommandHandler extends CommandHandler {
  execute = async (command, aggregate) => [new TestEvent({ message: command.message })];
}

class TestCommand_FailValidation extends Command {
  validate = async () => {
    throw new ValidationError({ command: this, message: 'Failed Validation' });
  }
}

class TestCommand extends Command {
  constructor(data = {}) {
    super(data);
    this.message = data.message;
  }

  validate = async () => true
}

class TestEvent extends Event {
  type = 'TestEvent'

  constructor(data = {}) {
    super(data);
    this.message = data.message;
  }

  update(aggregate) {
    aggregate.lastMessage = this.message;
  }
}

class TestAggregate extends Aggregate {
  constructor(id, events) {
    super(id, events);
  }
}

class CommandHandler_FailsValidation extends CommandHandler {
  validate = (command, aggregate) => {
    throw new ValidationError({ aggregate, command, message: 'Failed Aggregate Validation' });
  }
}
