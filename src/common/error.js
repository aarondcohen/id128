class NamedError extends Error {
	get name() { return this.constructor.name }
}

class InvalidIdError extends Error {}
class ClockSequenceOverflowError extends InvalidIdError {}
class InvalidSeedError extends InvalidIdError {}

class InvalidCoderError extends NamedError {}
class InvalidDecodingError extends InvalidCoderError {}
class InvalidEncodingError extends InvalidCoderError {}

module.exports = {
	ClockSequenceOverflowError,
	InvalidDecodingError,
	InvalidEncodingError,
	InvalidSeedError,
};
