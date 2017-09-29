import Identity from './identity';

export default class Command {

  constructor(data = {}) {
    this.$position = data.$position;
    this.$identity = new Identity(data.$identity) || Identity.anonymous;
    this.$scheduler = data.$scheduler || {};
  }

  validate = async function () {
    return true;
  }

  retry({ due, seconds }) {
    if (!due) {
      due = new Date();
      due.setSeconds(due.getSeconds() + seconds);
    }
    this.$scheduler.due = due;
  }
}
