import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);

import snapshot from '../src/snapshotDecorator';

describe('Snapshot Decorator', () => {
  it('has snapshot settings supplied in attribute', async () => {
    const testClass = new SnapshotTestClass();
    await expect(testClass.$snapshotSchedule.every).to.equal(10);
  });

  it('does not have snapshot settings when not specified on class', async () => {
    const testClass = new TestClass();
    await expect(testClass.$snapshotSchedule).to.be.undefined;
  });

  it('correctly passes constructor args when attributed', async () => {
    const testClass = new SnapshotTestClass('value 1');
    await expect(testClass.testValue).to.equal('value 1');
  });
});

class TestClass { }

@snapshot({ every: 10 })
class SnapshotTestClass {
  constructor(testValue) {
    this.testValue = testValue;
  }
}
