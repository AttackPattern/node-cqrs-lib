export default class Identity {
  constructor(data = {}) {
    this.username = data.username;
    this.userId = data.userId;
    this.claims = data.claims || {};
    this.version = data.version;
    this._rights = data.rights || [];
  }

  get rights() {
    return this._rights;
  }

  static anonymous = new Identity({
    userId: 'anonymous'
  })
  isAnonymous = () => this.userId === Identity.anonymous.userId

  static system = new Identity({
    userId: 'system'
  })
  isSystem = () => this.userId === Identity.system.userId

  isUser = () => !(this.isAnonymous() || this.isSystem())
}
