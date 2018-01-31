import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);

import Identity from '../src/auth/identity';
import authorize from '../src/auth/authorizeDecorator';
import anonymous from '../src/auth/anonymousDecorator';
import system from '../src/auth/systemDecorator';

describe('Authorize Decorator', () => {
  it('allows call when user has correct right', async () => {
    const testClass = new TestClass();
    await expect(testClass.authorize({ $identity: new Identity({ rights: ['rightA'] }) })).to.be.fulfilled;
  });

  it('throws authorization error when user does not have correct right', async () => {
    const testClass = new TestClass();
    await expect(testClass.authorize({ $identity: new Identity({ rights: ['rightB'] }) })).to.be.rejectedWith('Failed auth');
  });

  it('allows anonymous call when user is anonymous', async () => {
    const testClass = new AnonTestClass();
    await expect(testClass.authorize({ $identity: Identity.anonymous })).to.be.fulfilled;
  });

  it('throws on anonymous call when user is not anonymous', async () => {
    const testClass = new AnonTestClass();
    await expect(testClass.authorize({ $identity: new Identity() })).to.be.rejectedWith('Not anonymous');
  });

  it('allows system call when user is system', async () => {
    const testClass = new SystemTestClass();
    await expect(testClass.authorize({ $identity: Identity.system })).to.be.fulfilled;
  });

  it('throws on anonymous call when user is not anonymous', async () => {
    const testClass = new SystemTestClass();
    await expect(testClass.authorize({ $identity: new Identity() })).to.be.rejectedWith('Not system');
  });
});

@authorize({ rights: ['rightA'], message: 'Failed auth' })
class TestClass { }

@anonymous({ message: 'Not anonymous' })
class AnonTestClass { }

@system({ message: 'Not system' })
class SystemTestClass { }
