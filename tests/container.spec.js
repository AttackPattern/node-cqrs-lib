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

    let resolved = container.resolve(TestClass_ArgumentsConstructor);

    expect(resolved.dependency.name).to.equal('testDependency');
  });

  it('should fill allow derived dependencies', () => {
    const container = new Container();
    container.register(TestDependency, () => new DerivedTestDependency('testDependency'));

    let resolved = container.resolve(TestClass_ArgumentsConstructor);

    expect(resolved.dependency.name).to.equal('derived: testDependency');
  });

  it('should resolve unregistered dependency', () => {
    const container = new Container();

    let resolved = container.resolve(TestClass_ArgumentsConstructor);

    expect(resolved.dependency).to.be.instanceof(TestDependency);
  });

});

class TestDependency {
  constructor(name) {
    this.name = name;
  }
}

class DerivedTestDependency extends TestDependency {
  constructor(name) {
    super('derived: ' + name);
  }
}

class TestClass_EmptyConstructor {
}

@inject([TestDependency])
class TestClass_ArgumentsConstructor {
  constructor(dependency) {
    this.dependency = dependency;
  }
}
