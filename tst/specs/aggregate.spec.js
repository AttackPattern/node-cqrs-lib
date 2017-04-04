import { expect } from 'chai';
import sinon from 'sinon';
import Aggregate from '../../src/aggregate.js';

describe('Aggregate', function() {

    it('should have version number of last event in sequence', function() {
        let aggregate = new Aggregate('abc', [{ sequenceNumber: 1 }]);
        expect(aggregate.version).to.equal(1);

    })

})