import Identity from './identity';

export default class Command {

  constructor(data = {}) {
    this.$position = data.$position;
    this.$identity = new Identity(data.$identity) || Identity.anonymous;
  }

  validate = async function () {
    return true;
  }
}
