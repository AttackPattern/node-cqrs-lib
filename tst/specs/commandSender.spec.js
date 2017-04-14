import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);

import CommandSender from '../../src/commandSender.js';

describe('Command Sender', () => {

  // it('should return correct command url with pathless base url', async() => {
  //   let sender = new CommandSender('http://localhost');

  //   await expect(await sender.formatCommandUrl('aggregate', 'commandName'))
  //     .to.equal('http://localhost/aggregate/commandName');
  // });

  // it('should return correct command url with slash path base url', async() => {
  //   let sender = new CommandSender('http://localhost/');

  //   await expect(await sender.formatCommandUrl('aggregate', 'commandName'))
  //     .to.equal('http://localhost/aggregate/commandName');
  // });

  // it('should return correct command url with pathed base url', async() => {
  //   let sender = new CommandSender('http://localhost/path');

  //   await expect(await sender.formatCommandUrl('aggregate', 'commandName'))
  //     .to.equal('http://localhost/path/aggregate/commandName');
  // });

  // it('should return correct command url without aggregate', async() => {
  //   let sender = new CommandSender('http://targetService  ');

  //   await expect(await sender.formatCommandUrl('', 'commandName'))
  //     .to.equal('http://targetService/commandName');
  // });
});
