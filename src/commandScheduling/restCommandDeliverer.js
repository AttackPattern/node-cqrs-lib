import url from 'url';
import Identity from '../identity';

export default class RestCommandDeliverer {

  constructor(baseUrl, fetch) {
    this.baseUrl = url.parse(baseUrl + (baseUrl.endsWith('/') ? '' : '/'));
    this.fetch = fetch;
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
    let result = await this.fetch(commandUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'authorization': Identity.system.toAuthHeader()
      },
      body: JSON.stringify(command)
    });
    return result;
  }
}
