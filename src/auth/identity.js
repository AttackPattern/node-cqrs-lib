export default class Identity {
  constructor(data = {}) {
    this.username = data.username;
    this.userId = data.userId;
    this.claims = data.claims || {};
    this.roles = data.claims && data.claims.roles || [];
    this.version = data.version;
    this.rights = data.rights;
  }

  static anonymous = new Identity({
    userId: 'anonymous'
  })
  isAnonymous = () => this.userId === Identity.anonymous.userId

  static system = new Identity({
    userId: 'system'
  })
  isSystem = () => this.userId === Identity.system.userId
}
