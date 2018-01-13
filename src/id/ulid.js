const ByteArray = require('../common/byte-array');
const BaseId = require('./base');

const BYTE_RADIX = 1 << 8;
const TIME_BYTES = 6;
const EPOCH_MS_MAX = BYTE_RADIX ** TIME_BYTES;
const DATE_MIN_ISO = new Date(0).toISOString();
const DATE_MAX_ISO = new Date(EPOCH_MS_MAX - 1).toISOString();

const _setTime = (epoch_ms, bytes) => {
	for (let idx = TIME_BYTES - 1; idx > -1; --idx) {
		let rem = epoch_ms % BYTE_RADIX;
		epoch_ms = (epoch_ms - rem) / BYTE_RADIX;
		bytes[idx] = rem;
	}
};

const _validateTime = (time) => {
	if (! (time instanceof Date)) {
		throw new TypeError('Time must be a Date');
	}

	const epoch_ms = time.getTime();

	if (epoch_ms < 0 || epoch_ms >= EPOCH_MS_MAX) {
		throw new RangeError(`Time must be between ${DATE_MIN_ISO} and ${DATE_MAX_ISO}`);
	}
};

class Ulid extends BaseId {

	//Constructors

	static generate(time = null) {
		if (Number.isInteger(time)) {
			time = new Date(time);
		}
		else if (time === null) {
			time = new Date();
		}

		_validateTime(time);

		let bytes = ByteArray.generateRandomFilled();

		_setTime(time.getTime(), bytes);

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
		const epoch_ms = this.bytes
			.subarray(0, TIME_BYTES)
			.reduce((acc, val) => (acc * BYTE_RADIX + val), 0);

		return new Date(epoch_ms);
	}
}

module.exports = Ulid;
