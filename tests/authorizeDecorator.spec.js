import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);

import Identity from '../src/auth/identity';
import authorize from '../src/auth/authorizeDecorator';
import anonymous from '../src/auth/anonymousDecorator';
import system from '../src/auth/systemDecorator';
import AuthorizationError from '../src/auth/authorizationError';

describe('Authorize Decorator', () => {
  it('allows call when user has correct right', async () => {
    const testClass = new TestClass();
    await expect(testClass.authorize({ $identity: new Identity({ rights: ['rightA'] }) })).to.be.fulfilled;
  });

  it('throws authorization error when user does not have correct right', async () => {
    const testClass = new TestClass();
    await expect(testClass.authorize({ $identity: new Identity({ rights: ['rightB'] }) })).to.be.rejectedWith('Failed auth');
  });

  it('preserves constructor arguments with authorize attribute', async () => {
    const testClass = new TestClass('authTest');
    expect(testClass.value).to.equal('authTest');
  });

  it('allows anonymous call when user is anonymous', async () => {
    const testClass = new AnonTestClass();
    await expect(testClass.authorize({ $identity: Identity.anonymous })).to.be.fulfilled;
  });

  it('throws on anonymous call when user is not anonymous', async () => {
    const testClass = new AnonTestClass();
    await expect(testClass.authorize({ $identity: new Identity() })).to.be.rejectedWith('Not anonymous');
  });

  it('preserves constructor arguments with anonymous attribute', async () => {
    const testClass = new AnonTestClass('anonTest');
    expect(testClass.value).to.equal('anonTest');
  });

  it('allows system call when user is system', async () => {
    const testClass = new SystemTestClass();
    await expect(testClass.authorize({ $identity: Identity.system })).to.be.fulfilled;
  });

  it('throws on anonymous call when user is not anonymous', async () => {
    const testClass = new SystemTestClass();
    await expect(testClass.authorize({ $identity: new Identity() })).to.be.rejectedWith('Not system');
  });

  it('preserves constructor arguments with system attribute', async () => {
    const testClass = new SystemTestClass('sysTest');
    expect(testClass.value).to.equal('sysTest');
  });

  it('supports derived identity class rights', async () => {
    const testClass = new TestClass();
    await expect(testClass.authorize({ $identity: new TestIdentity({}, false) })).to.be.fulfilled;
  });

  it('calls base authorize method along with attribute', async () => {
    const testClass = new TestClassWithAuthorizeMethod(false);
    await expect(testClass.authorize({ $identity: new TestIdentity({}, false) })).to.be.rejectedWith('Pass is false');
  })
});

@authorize({ rights: ['rightA'], message: 'Failed auth' })
class TestClass {
  constructor(value) {
    this.value = value;
  }
}

@anonymous({ message: 'Not anonymous' })
class AnonTestClass {
  constructor(value) {
    this.value = value;
  }
}

@system({ message: 'Not system' })
class SystemTestClass {
  constructor(value) {
    this.value = value;
  }
}

@authorize({ rights: ['rightA'] })
class TestClassWithAuthorizeMethod {
  constructor(pass) {
    this.pass = pass;
  }

  authorize = async (command, aggregate) => {
    if (!this.pass) {
      throw new AuthorizationError({ command, aggregate, message: 'Pass is false' });
    }
  }
}

class TestIdentity extends Identity {
  constructor(data) {
    super(data);
  }

  get rights() {
    return ['rightA'];
  }
}
