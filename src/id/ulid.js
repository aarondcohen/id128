const ByteArray = require('../common/byte-array');
const EpochConverter = require('../common/epoch-converter');
const UintConverter = require('../common/uint-converter');
const { BaseId } = require('./base');

const TIME_OFFSET = 0;
const RANDOM_OFFSET = 6;

const EPOCH_ORIGIN_MS = 0;

function setTime(time, bytes) {
	UintConverter.assignUint(
		TIME_OFFSET,
		RANDOM_OFFSET,
		bytes,
		time
	);
};

class Ulid extends BaseId {

	//Constructors

	static generate({ time } = {}) {
		time = EpochConverter.toEpoch(EPOCH_ORIGIN_MS, time);

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
		return EpochConverter.fromEpoch(EPOCH_ORIGIN_MS, epoch_ms);
	};
}

module.exports = { Ulid, setTime };
