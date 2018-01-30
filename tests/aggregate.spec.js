import { expect } from 'chai';
import Aggregate from '../src/aggregate.js';
import Event from '../src/event';

describe('Aggregate', () => {

  it('should have an initial sequence number of 0', () => {
    let aggregate = new Aggregate('abc');
    expect(aggregate.version).to.equal(0);
  });

  it('should have version number of last event in sequence', () => {
    let aggregate = new Aggregate('abc', [new Event({ sequenceNumber: 1 }), new Event({ sequenceNumber: 3 })]);
    expect(aggregate.version).to.equal(3);
  });

  it('should reject out-of-order events in constructor', () => {
    expect(() => new Aggregate('abc', [{ sequenceNumber: 3 }, { sequenceNumber: 1 }]))
      .to.throw(Error);
  });

  it('should reject out-of-order events applied after construction', () => {
    let aggregate = new Aggregate('abc', [new Event({ sequenceNumber: 3 })]);
    expect(() => aggregate.applyEvents([new Event({ sequenceNumber: 1 })]))
      .to.throw(Error);
  });

  it('should reject duplicate event sequence number', () => {
    let aggregate = new Aggregate('abc', [new Event({ sequenceNumber: 1 })]);
    expect(() => aggregate.applyEvents([new Event({ sequenceNumber: 1 })]))
      .to.throw(Error);
  });

  it('should set aggregate Id on new event', () => {
    let aggregateId = 'abc';
    let aggregate = new Aggregate(aggregateId);
    let event = new Event();
    aggregate.applyEvents([event]);

    expect(event.aggregateId).to.equal(aggregateId);
  });

  it('should advance aggregate version when adding an event', () => {
    let aggregate = new Aggregate('abc', [new Event({ sequenceNumber: 2 })]);
    let event = new Event();
    aggregate.applyEvents([event]);
    expect(aggregate.version).to.equal(3);
    expect(event.sequenceNumber).to.equal(3);
  });
});
