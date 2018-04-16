import Identity from './auth/identity';

export default class Command {

  constructor(data = {}) {
    this.$position = data.$position;
    this.$identity = new Identity(data.$identity) || Identity.anonymous;
    this.$timestamp = data.$timestamp || new Date();
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
