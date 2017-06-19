export default class Identity {
  constructor(data = {}) {
    this.username = data.username;
    this.userId = data.userId;
    this.responderId = data.responderId;
    this.claims = data.claims;
  }

  static anonymous = new Identity({
    userId: 'anonymous'
  })

  static system = new Identity({
    userId: 'system'
  })

  toAuthHeader() {
    return new Buffer(JSON.stringify(this)).toString('base64');
  }

  isSystem() {
    return this.userId === Identity.system.userId;
  }
}
