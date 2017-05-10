import url from 'url';

export default class RestCommandDeliverer {

  constructor(baseUrl, fetch) {
    this.baseUrl = url.parse(baseUrl + (baseUrl.endsWith('/') ? '' : '/'));
    this.fetch = fetch;
  }

  formatCommandUrl(target, commandName) {
    return url.format({
      protocol: this.baseUrl.protocol,
      host: this.baseUrl.host,
      pathname: `${this.baseUrl.pathname}${target ? target + '/' : ''}${commandName}`
    });
  }

  deliver = async(target, command) => {
    let commandUrl = this.formatCommandUrl(target, command.name);
    let result = await this.fetch(commandUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(command)
    });
    return result;
  }
}
