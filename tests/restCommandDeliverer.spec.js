import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);

import Command from '../src/command';
import RestCommandDeliverer from '../src/commandScheduling/restCommandDeliverer';

describe('Rest Command Deliverer', () => {
  it('should call to url with command name when no target', async () => {
    let fetch = new VirtualFetch();
    let deliverer = new RestCommandDeliverer('http://baseurl', (url, options) => fetch.fetch(url, options), () => 'systemIdentity');
    await deliverer.deliver({ service: 'rest', target: undefined, command: new TestCommand() });

    expect(fetch.calls[0].url).to.equal('http://baseurl/rest/test');
  });

  it('should call to url with command name', async () => {
    let fetch = new VirtualFetch();
    let deliverer = new RestCommandDeliverer('http://baseurl', (url, options) => fetch.fetch(url, options), () => 'systemIdentity');
    await deliverer.deliver({ service: 'rest', target: 'abc123', command: new TestCommand() });

    expect(fetch.calls[0].url).to.equal('http://baseurl/rest/abc123/test');
  });

  it('should use supplied system Identity in call', async () => {
    let fetch = new VirtualFetch();
    let deliverer = new RestCommandDeliverer('http://baseurl', (url, options) => fetch.fetch(url, options), () => 'systemIdentity');
    await deliverer.deliver({ service: 'rest', target: 'abc123', command: new TestCommand() });

    expect(fetch.calls[0].options.headers.authorization).to.equal('systemIdentity');
  });
});

class TestCommand extends Command {
  type = 'test'
}

class VirtualFetch {
  constructor() {
    this.calls = [];
  }
  fetch = async (url, options) => {
    this.calls.push({ url: url, options: options });
    return {
      json: () => { }
    };
  }
}
