import AuthorizationError from './authorizationError';

export default function check({ rights }) {
  return (Target, property, descriptor) => {
    return () => {
      const t = new Target();
      t.authorize = async (command, job) => {
        if (!rights.some(c => command.$identity.rights.includes(c))) {
          throw new AuthorizationError({ aggregate: job, command, message: 'User is not allowed to issue this command' });
        }
      };
      return t;
    };
  };
}
