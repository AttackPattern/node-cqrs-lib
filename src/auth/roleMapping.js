
export default class RoleMapping {
  constructor(mappings) {
    this.mappings = mappings;
  }

  getCapabilities(roles) {
    let caps = Object.entries(this.mappings)
      .map(entry => ({ role: entry[0], caps: entry[1] }))
      .filter(r => roles.includes(r.role))
      .reduce((result, r) => {
        r.caps.forEach(c => {
          result[c] = true;
        });
        return result;
      }, {});
    return Object.keys(caps);
  }
}
