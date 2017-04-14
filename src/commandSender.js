import url from 'url';
import fetch from 'node-fetch';

export default class CommandSender {

  constructor(baseUrl) {
    this.baseUrl = url.parse(baseUrl + (baseUrl.endsWith('/') ? '' : '/'));
  }

  formatCommandUrl(commandName) {
    return url.format({
      protocol: this.baseUrl.protocol,
      host: this.baseUrl.host,
      pathname: `${this.baseUrl.pathname}${commandName}`
    });
  }

  send = async(command) => {
    let commandUrl = this.formatCommandUrl(command.name);

    let result = await fetch(commandUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(command)
    });

    console.log(result);
    return result;
  }
}
