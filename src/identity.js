export default class Identity {
  constructor(data = {}) {
    this.username = data.username;
    this.userId = data.userId;
    this.claims = data.claims;
  }

  static anonymous = new Identity({
    userId: 'anonymous'
  })

  static system = new Identity({
    userId: 'system'
  })

  isSystem() {
    return this.userId === Identity.system.userId;
  }
}
