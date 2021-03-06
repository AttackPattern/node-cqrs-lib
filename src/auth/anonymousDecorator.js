import AuthorizationError from './authorizationError';

export default function anonymous({ message = 'You must be anonymous to invoke this command' } = {}) {
  return (Target, property, descriptor) => {
    return (...args) => {
      const t = new Target(...args);
      t.authorize = async (command, aggregate) => {
        if (!command.$identity.isAnonymous()) {
          throw new AuthorizationError({ command, aggregate, message: message });
        }
      };
      return t;
    };
  };
}
