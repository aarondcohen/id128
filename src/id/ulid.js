const ByteArray = require('../common/byte-array');
const EpochConverter = require('../common/epoch-converter');
const { BaseId } = require('./base');

const TIME_OFFSET = 0;

const EPOCH_ORIGIN_MS = 0;
const UINT32_RADIX = Math.pow(2, 32);
const UINT8_MAX = 0b11111111;

function setTime(time, bytes) {
	const time_low = time % UINT32_RADIX;
	const time_high = (time - time_low) / UINT32_RADIX;

	let idx = TIME_OFFSET - 1;
	bytes[++idx] = (time_high >>> 8) & UINT8_MAX;
	bytes[++idx] = (time_high >>> 0) & UINT8_MAX;
	bytes[++idx] = (time_low >>> 24) & UINT8_MAX;
	bytes[++idx] = (time_low >>> 16) & UINT8_MAX;
	bytes[++idx] = (time_low >>> 8) & UINT8_MAX;
	bytes[++idx] = (time_low >>> 0) & UINT8_MAX;
}

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
		let idx = TIME_OFFSET - 1;
		const time_high = 0
			| (this.bytes[++idx] << 8)
			| (this.bytes[++idx] << 0);
		const time_low = 0
			| (this.bytes[++idx] << 24)
			| (this.bytes[++idx] << 16)
			| (this.bytes[++idx] << 8)
			| (this.bytes[++idx] << 0);
		const epoch_ms = (time_high * UINT32_RADIX) + (time_low >>> 0);

		return EpochConverter.fromEpoch(EPOCH_ORIGIN_MS, epoch_ms);
	};
}

module.exports = { Ulid, setTime };
