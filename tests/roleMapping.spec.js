import { expect } from 'chai';
import RoleMapping from '../src/auth/roleMapping';

describe('RoleMapping', () => {
  it('should have capabilities of specified role', () => {
    let mapping = new RoleMapping({
      friend: ['a', 'b']
    });
    expect(mapping.getCapabilities(['friend'])).to
      .contain('a').and
      .contain('b').and.not
      .contain('c');
  });

  it('should have unique capabilities of specified roles', () => {
    let mapping = new RoleMapping({
      friend: ['a'],
      bestFriend: ['b']
    });
    expect(mapping.getCapabilities(['friend', 'bestFriend'])).to
      .contain('a').and
      .contain('b').and
      .length(2);
  });
});
