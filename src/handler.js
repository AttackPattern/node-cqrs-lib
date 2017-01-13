export default class Handler {

  constructor(repository) {
    this.repository = repository;
  }

  execute = async () => {
    throw new Error('you need to set an execute method for your command handler');
  }

}
