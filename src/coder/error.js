class InvalidCoderError extends Error {
	constructor(message) {
		super(message)

		this.name = this.constructor.name;
		delete this.stack;
	}
}

class InvalidDecodingError extends InvalidCoderError {}
class InvalidEncodingError extends InvalidCoderError {}

module.exports = {
	InvalidDecodingError,
	InvalidEncodingError,
};
