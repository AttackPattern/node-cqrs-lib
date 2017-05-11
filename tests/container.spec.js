import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);

import Container, { inject } from '../src/container.js';

describe('Container', () => {
  it('should use factory to resolve simple type', async() => {
    const container = new Container();
    let target = new TestClass_EmptyConstructor();
    container.register(TestClass_EmptyConstructor, () => target);

    let resolved = container.resolve(TestClass_EmptyConstructor);

    expect(resolved).to.equal(target);
  });

  it('should construct class when type is not registered', () => {
    const container = new Container();

    let resolved = container.resolve(TestClass_EmptyConstructor);

    expect(resolved).to.be.instanceof(TestClass_EmptyConstructor);
  });

  it('should create new instances when type is not registered', () => {
    const container = new Container();

    expect(container.resolve(TestClass_EmptyConstructor)).to.not.equal(container.resolve(TestClass_EmptyConstructor));
  });

  it('should fill injected constructor arguments', () => {
    const container = new Container();
    container.register(TestDependency, () => new TestDependency('testDependency'));

    let resolved = container.resolve(TestClass_WithDependencies);

    expect(resolved.dependency.message).to.equal('testDependency');
    expect(resolved.testClass).to.be.instanceof(TestClass_EmptyConstructor);
  });

  it('should fill allow derived dependencies', () => {
    const container = new Container();
    container.register(TestDependency, () => new DerivedTestDependency('testDependency'));

    let resolved = container.resolve(TestClass_WithDependencies);

    expect(resolved.dependency.message).to.equal('derived: testDependency');
  });

  it('should resolve unregistered dependency', () => {
    const container = new Container();

    let resolved = container.resolve(TestClass_WithDependencies);

    expect(resolved.dependency).to.be.instanceof(TestDependency);
  });

  it('should resolve named registration', () => {
    const container = new Container();
    container.register('message', () => 'test message');

    let resolved = container.resolve(TestClass_WithStringRegisteredDependency);

    expect(resolved.message).to.equal('test message');
  });
});

class TestDependency {
  constructor(message) {
    this.message = message;
  }
}

class DerivedTestDependency extends TestDependency {
  constructor(message) {
    super('derived: ' + message);
  }
}

class TestClass_EmptyConstructor {}

@inject(TestDependency, TestClass_EmptyConstructor)
class TestClass_WithDependencies {
  constructor(dependency, testClass) {
    this.dependency = dependency;
    this.testClass = testClass;
  }
}

@inject('message')
class TestClass_WithStringRegisteredDependency {
  constructor(message) {
    this.message = message;
  }
}
