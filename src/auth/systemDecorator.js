import AuthorizationError from './authorizationError';

export default function system({ message = 'Only the system can invoke this command' } = {}) {
  return (Target, property, descriptor) => {
    return () => {
      const t = new Target();
      t.authorize = async (command, aggregate) => {
        if (!command.$identity.isSystem()) {
          throw new AuthorizationError({ command, aggregate, message: message });
        }
      };
      return t;
    };
  };
}
