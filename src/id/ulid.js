const ByteArray = require('../common/byte-array');
const UintConverter = require('../common/uint-converter');
const { BaseId } = require('./base');
const { InvalidSeed } = require('../common/exception');

const TIME_OFFSET = 0;
const RANDOM_OFFSET = 6;

const EPOCH_MS_MAX = Math.pow(2, (RANDOM_OFFSET - TIME_OFFSET) * 8);
const DATE_MIN_ISO = new Date(0).toISOString();
const DATE_MAX_ISO = new Date(EPOCH_MS_MAX - 1).toISOString();

function coerceTime(time = null) {
	return (
		Number.isInteger(time) ? new Date(time) :
		time === null ? new Date() :
			time
	);
};

function setTime(time, bytes) {
	UintConverter.assignUint(
		TIME_OFFSET,
		RANDOM_OFFSET,
		bytes,
		time.getTime()
	);
};

function validateTime(time) {
	if (! (time instanceof Date)) {
		throw new InvalidSeed('Time must be a Date');
	}

	const epoch_ms = time.getTime();

	if (epoch_ms < 0 || epoch_ms >= EPOCH_MS_MAX) {
		throw new InvalidSeed(`Time must be between ${DATE_MIN_ISO} and ${DATE_MAX_ISO}`);
	}
};

class Ulid extends BaseId {

	//Constructors

	static generate({ time } = {}) {
		time = coerceTime(time);
		validateTime(time);

		let bytes = ByteArray.generateRandomFilled();

		setTime(time, bytes);

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
		const epoch_ms = UintConverter.extractUint(
			TIME_OFFSET,
			RANDOM_OFFSET,
			this.bytes
		);
		return new Date(epoch_ms);
	};
}

module.exports = { Ulid, coerceTime, setTime, validateTime };
