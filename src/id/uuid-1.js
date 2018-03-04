'use strict';

const ByteArray = require('../common/byte-array');
const EpochConverter = require('../common/epoch-converter');
const Machine = require('../common/machine');
const {
	Uuid,
	setVariant,
	setVersion,
} = require('./uuid');

const TIME_OFFSET = 0;
const TIME_LOW_OFFSET = 0;
const TIME_MID_OFFSET = 4;
const TIME_HIGH_OFFSET = 6;
const CLOCK_SEQUENCE_OFFSET = 8;
const NODE_OFFSET = 10;

const CLOCK_SEQUENCE_RADIX = Math.pow(2, 14);
const EPOCH_ORIGIN_MS = Date.parse('1582-10-15Z');
const TIME_HIRES_RADIX = Math.pow(2, 12);
const TIME_LOW_MS_RADIX = Math.pow(2, 20);
const TIME_MID_RADIX = Math.pow(2, 16);
const UINT8_MAX = 0b11111111;

let _clock_sequence;
let _hires_time;
let _previous_time;

function incrementClockSequence() {
	_clock_sequence = (_clock_sequence + 1) % CLOCK_SEQUENCE_RADIX;
}

function setClockSequence(time, bytes) {
	if (_clock_sequence === null) {
		const random_bytes = ByteArray.generateRandomFilled();
		_clock_sequence = ((0
			| (random_bytes[CLOCK_SEQUENCE_OFFSET + 0] << 8)
			| (random_bytes[CLOCK_SEQUENCE_OFFSET + 1] << 0)
		) >>> 0) % CLOCK_SEQUENCE_RADIX;
	}
	else if (time < _previous_time) {
		incrementClockSequence();
	}

	let idx = CLOCK_SEQUENCE_OFFSET - 1;
	bytes[++idx] = (_clock_sequence >>> 8) & UINT8_MAX;
	bytes[++idx] = (_clock_sequence >>> 0) & UINT8_MAX;
}

function setNode(node, bytes) {
	for (let idx = 0; idx < 6; ++idx) {
		bytes[NODE_OFFSET + idx] = node[idx];
	}
}

function setTime(time, bytes) {
	_hires_time = time > _previous_time ? 0 : _hires_time + 1;
	if (_hires_time === TIME_HIRES_RADIX) {
		_hires_time = 0;
		incrementClockSequence();
	}

	const time_low_ms = time % TIME_LOW_MS_RADIX;
	const time_low = time_low_ms * TIME_HIRES_RADIX + _hires_time;
	const time_high = (time - time_low_ms) / TIME_LOW_MS_RADIX;

	let idx = TIME_OFFSET - 1;
	bytes[++idx] = (time_low >>> 24) & UINT8_MAX;
	bytes[++idx] = (time_low >>> 16) & UINT8_MAX;
	bytes[++idx] = (time_low >>> 8) & UINT8_MAX;
	bytes[++idx] = (time_low >>> 0) & UINT8_MAX;
	bytes[++idx] = (time_high >>> 8) & UINT8_MAX;
	bytes[++idx] = (time_high >>> 0) & UINT8_MAX;
	bytes[++idx] = (time_high >>> 24) & UINT8_MAX;
	bytes[++idx] = (time_high >>> 16) & UINT8_MAX;
}

class Uuid1 extends Uuid {
	static get VARIANT() { return 1 }
	static get VERSION() { return 1 }

	static reset() {
		_clock_sequence = null;
		_hires_time = -1;
		_previous_time = -1;
	}

	//Constructors

	static generate({ node, time } = {}) {
		time = EpochConverter.toEpoch(EPOCH_ORIGIN_MS, time);

		let bytes = ByteArray.generateZeroFilled();

		setTime(time, bytes);
		setClockSequence(time, bytes);
		setNode(node || Machine.mac_address, bytes);
		setVariant(this.VARIANT, bytes);
		setVersion(this.VERSION, bytes);

		if (time > _previous_time) {
			_previous_time = time;
		}

		return new this(bytes);
	}

	// Accessors

	get clock_sequence() {
		return ((this.bytes[8] << 8) | this.bytes[9]) & (CLOCK_SEQUENCE_RADIX - 1);
	}

	get hires_time() {
		return ((this.bytes[2] << 8) | this.bytes[3]) & (TIME_HIRES_RADIX - 1);
	}

	get node() {
		return this.bytes.slice(NODE_OFFSET);
	}

	get time() {
		let idx = TIME_OFFSET - 1;
		const time_low_ms = 0
			| (this.bytes[++idx] << 12)
			| (this.bytes[++idx] << 4)
			| (this.bytes[++idx] >>> 4);
		++idx; // Skip hires bits
		const time_high = 0
			| (this.bytes[++idx] << 8)
			| (this.bytes[++idx] << 0)
			| ((this.bytes[++idx] & 0x0F) << 24)
			| (this.bytes[++idx] << 16);
		const epoch_ms = time_high * TIME_LOW_MS_RADIX + time_low_ms;

		return EpochConverter.fromEpoch(EPOCH_ORIGIN_MS, epoch_ms);
	};
}

Uuid1.reset();

module.exports = { Uuid1 };
