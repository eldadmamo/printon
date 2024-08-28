export class NotFoundError {
    name: string;
    message: string;
    stack: string;

    constructor(message) {
        this.name = this.constructor.name;
        this.message = message;
        this.stack = new Error(message).stack;
    }
}

// this is needes as babel does not support extending Error out of the box
NotFoundError.prototype = Object.create(Error.prototype);
NotFoundError.prototype.constructor = NotFoundError;
