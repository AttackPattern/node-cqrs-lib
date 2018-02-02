export default function snapshot({ every } = {}) {
  return (Target, property, descriptor) => {
    return (...args) => {
      const t = new Target(...args);
      t.$snapshotSchedule = {
        every
      };
      return t;
    };
  };
}
