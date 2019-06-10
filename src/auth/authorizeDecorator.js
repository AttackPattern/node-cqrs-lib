import AuthorizationError from './authorizationError';

export default function check({ rights = [], message = 'User is not allowed to issue this command' } = {}) {
  return (Target, property, descriptor) => {
    return (...args) => {
      const t = new Target(...args);
      const targetAuthorizeMethod = t.authorize;
      t.authorize = async (command, aggregate) => {
        if (command.$identity.isSystem()) {
          return t;
        }
        if (!rights.some(c => command.$identity.rights.includes(c))) {
          throw new AuthorizationError({ aggregate: aggregate, command, message });
        }
        if (targetAuthorizeMethod) {
          await targetAuthorizeMethod(command, aggregate);
        }
      };
      return t;
    };
  };
}
