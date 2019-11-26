import jwt from 'jsonwebtoken';

export default class Schedule {

  constructor({ id, service, target, created, clock, secret, seconds }) {
    this.id = id;
    this.service = service;
    this.target = target;
    this.created = created;
    this.clock = clock;
    this.secret = secret;
    this.token = jwt.sign({ service, target }, secret, {
      expiresIn: seconds * 2 // in case a delivery is delayed
  });
  }
}
