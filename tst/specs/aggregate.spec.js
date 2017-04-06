import { expect } from 'chai';
import sinon from 'sinon';
import Aggregate from '../../src/aggregate.js';

describe('Aggregate', () => {

  it('should have an initial sequence number of 0', () => {
    let aggregate = new Aggregate('abc');
    expect(aggregate.version).to.equal(0);
  })

  it('should have version number of last event in sequence', () => {
    let aggregate = new Aggregate('abc', [{ sequenceNumber: 1 }, { sequenceNumber: 3 }]);
    expect(aggregate.version).to.equal(3);
  })

  it('should reject out-of-order events in constructor', () => {
    expect(() => new Aggregate('abc', [{ sequenceNumber: 3 }, { sequenceNumber: 1 }]))
      .to.throw(Error);
  })

  it('should reject out-of-order events applied after construction', () => {
    let aggregate = new Aggregate('abc', [{ sequenceNumber: 3 }]);
    expect(() => aggregate.applyEvents([{sequenceNumber: 1}]))
      .to.throw(Error);
  })

  it('should reject duplicate event sequence number', () => {
    let aggregate = new Aggregate('abc', [{ sequenceNumber: 1 }]);
    expect(() => aggregate.applyEvents([{sequenceNumber: 1}]))
      .to.throw(Error);
  })
})
