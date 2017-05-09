export default class Command {

  constructor(data = {}) {
    this.$position = data.$position || {};
    this.$identity = data.$identity || {};
  }

  validate = async function () {
    return true;
  }
}
