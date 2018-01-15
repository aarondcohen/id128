const ByteArray = require('../common/byte-array');
const { BaseId } = require('./base');
const { InvalidSeedError } = require('../common/error');

const BYTE_RADIX = 1 << 8;
const TIME_BYTES = 6;
const EPOCH_MS_MAX = Math.pow(BYTE_RADIX, TIME_BYTES);
const DATE_MIN_ISO = new Date(0).toISOString();
const DATE_MAX_ISO = new Date(EPOCH_MS_MAX - 1).toISOString();

const _coerceTime = (time = null) => (
	Number.isInteger(time) ? new Date(time) :
	time === null ? new Date() :
		time
);

const _setTime = (time, bytes) => {
	let epoch_ms = time.getTime();
	for (let idx = TIME_BYTES - 1; idx > -1; --idx) {
		let rem = epoch_ms % BYTE_RADIX;
		epoch_ms = (epoch_ms - rem) / BYTE_RADIX;
		bytes[idx] = rem;
	}
};

const _validateTime = (time) => {
	if (! (time instanceof Date)) {
		throw new InvalidSeedError('Time must be a Date');
	}

	const epoch_ms = time.getTime();

	if (epoch_ms < 0 || epoch_ms >= EPOCH_MS_MAX) {
		throw new InvalidSeedError(`Time must be between ${DATE_MIN_ISO} and ${DATE_MAX_ISO}`);
	}
};

class Ulid extends BaseId {

	//Constructors

	static generate(time) {
		time = _coerceTime(time);
		_validateTime(time);

		let bytes = ByteArray.generateRandomFilled();

		_setTime(time, bytes);

		return new this(bytes);
	}

	static MIN() {
		return new this(ByteArray.generateZeroFilled());
	}

	static MAX() {
		return new this(ByteArray.generateOneFilled());
	}

	// Accessors

	get time() {
		let epoch_ms = 0;
		for (let idx = 0; idx < TIME_BYTES; ++idx) {
			epoch_ms = epoch_ms * BYTE_RADIX + this.bytes[idx];
		}
		return new Date(epoch_ms);
	}
}

module.exports = { Ulid };
