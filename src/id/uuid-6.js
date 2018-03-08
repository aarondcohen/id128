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
const HIRES_TIME_OFFSET = 6;
const CLOCK_SEQUENCE_OFFSET = 8;
const NODE_OFFSET = 10;

const CLOCK_SEQUENCE_RADIX = Math.pow(2, 14);
const EPOCH_ORIGIN_MS = Date.parse('1582-10-15Z');
const HIRES_TIME_RADIX = Math.pow(2, 12);
const UINT32_RADIX = Math.pow(2, 32);
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
		_clock_sequence = (
			0
			| random_bytes[CLOCK_SEQUENCE_OFFSET + 0] << 8
			| random_bytes[CLOCK_SEQUENCE_OFFSET + 1] << 0
		) % CLOCK_SEQUENCE_RADIX;
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
	if (_hires_time === HIRES_TIME_RADIX) {
		_hires_time = 0;
		incrementClockSequence();
	}

	const time_low = time % UINT32_RADIX;
	const time_high = (time - time_low) / UINT32_RADIX;

	let idx = TIME_OFFSET - 1;
	bytes[++idx] = (time_high >>> 8) & UINT8_MAX;
	bytes[++idx] = (time_high >>> 0) & UINT8_MAX;
	bytes[++idx] = (time_low >>> 24) & UINT8_MAX;
	bytes[++idx] = (time_low >>> 16) & UINT8_MAX;
	bytes[++idx] = (time_low >>> 8) & UINT8_MAX;
	bytes[++idx] = (time_low >>> 0) & UINT8_MAX;
	bytes[++idx] = (_hires_time >>> 8) & UINT8_MAX;
	bytes[++idx] = (_hires_time >>> 0) & UINT8_MAX;
}

class Uuid6 extends Uuid {
	static get VARIANT() { return 1 }
	static get VERSION() { return 6 }

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
		return (
			0
			| this.bytes[CLOCK_SEQUENCE_OFFSET] << 8
			| this.bytes[CLOCK_SEQUENCE_OFFSET + 1]
		) & (CLOCK_SEQUENCE_RADIX - 1);
	}

	get hires_time() {
		return (
			0
			| this.bytes[HIRES_TIME_OFFSET] << 8
			| this.bytes[HIRES_TIME_OFFSET + 1]
		) & (HIRES_TIME_RADIX - 1);
	}

	get node() {
		return this.bytes.slice(NODE_OFFSET);
	}

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

Uuid6.reset();

module.exports = { Uuid6 };
