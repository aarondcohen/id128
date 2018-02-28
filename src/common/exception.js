class Id128Error extends Error {
	get name() { return this.constructor.name }
}

class ClockSequenceOverflow extends Id128Error {}
class InvalidBytes extends Id128Error {}
class InvalidEncoding extends Id128Error {}
class InvalidEpoch extends Id128Error {}

module.exports = {
	Id128Error,
	ClockSequenceOverflow,
	InvalidBytes,
	InvalidEncoding,
	InvalidEpoch,
};
