export default class ValidationError extends Error {

    constructor(aggregate, command, message) {
        super(message);

        this.name = 'ValidationError';
        this.aggregate = aggregate;
        this.command = command;
        this.message = message;
    }

}
