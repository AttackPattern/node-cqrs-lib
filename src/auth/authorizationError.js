export default class AuthorizationError extends Error {

    constructor({ aggregate, command, message = 'Not authorized to perform this command' }) {
        super(message);

        this.name = 'AuthorizationError';
        this.aggregate = aggregate;
        this.command = command;
        this.message = message;
    }

}
