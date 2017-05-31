export default class Identity {
  constructor(data = {}) {
    this.username = data.username;
    this.responderId = data.responderId;
    this.claims = data.claims;

    // TODO (brett) - This should be an actual user id
    this.userId = data.userId || data.responderId;
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
}
