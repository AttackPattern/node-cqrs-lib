import url from 'url';
import Identity from '../identity';

export default class RestCommandDeliverer {

  constructor(baseUrl, fetch, getSystemIdentity) {
    this.baseUrl = url.parse(baseUrl + (baseUrl.endsWith('/') ? '' : '/'));
    this.fetch = fetch;
    this.getSystemIdentity = getSystemIdentity;
  }

  formatCommandUrl({ service, target, command }) {
    return url.format({
      protocol: this.baseUrl.protocol,
      host: this.baseUrl.host,
      pathname: `${this.baseUrl.pathname}${service ? service + '/' : ''}${target ? target + '/' : ''}${command}`
    });
  }

  deliver = async({ service, target, command }) => {
    let commandUrl = this.formatCommandUrl({ service, target, command: command.type });
    let id = await this.getSystemIdentity();

    return (await this.fetch(commandUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: id,
        position: command.$position && new Buffer(JSON.stringify(command.$position)).toString('base64')
      },
      body: JSON.stringify(command)
    })).json();
  }
}
