import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);

import Command from '../../src/command.js';
import CommandHandler from '../../src/commandHandler.js';
import ValidationError from '../../src/validationError.js';

describe('Command Handler', () => {
  it('should throw on a failed command validation', async() => {
    let handler = new CommandHandler(TestCommand_FailValidation);

    await expect(handler.handle({})).to.be.rejectedWith('Failed Validation');
  });
});

class TestCommand_FailValidation extends Command {
  validate = async() => {
    throw new ValidationError(null, this, 'Failed Validation');
  }
}
