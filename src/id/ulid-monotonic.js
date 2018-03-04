const { Ulid, setTime } = require('./ulid');
const ByteArray = require('../common/byte-array');
const EpochConverter = require('../common/epoch-converter');
const { ClockSequenceOverflow } = require('../common/exception');

const TIME_OFFSET = 0;
const CLOCK_SEQUENCE_OFFSET = 6;
const RANDOM_OFFSET = 8;

const EPOCH_ORIGIN_MS = 0;

let _previous_id;
let _previous_time;

function incrementClockSequence(bytes) {
	for (
		let
			idx = RANDOM_OFFSET - 1,
			end = CLOCK_SEQUENCE_OFFSET - 1;
		idx > end;
		--idx
	) {
		if (bytes[idx] === 0xFF) {
			bytes[idx] = 0;
		} else {
			++bytes[idx];
			return;
		}
	}

	throw new ClockSequenceOverflow('Exhausted clock sequence');
};

function reserveClockSequence(bytes) {
	bytes[CLOCK_SEQUENCE_OFFSET] &= 0b01111111;
};

function restoreClockSequence(bytes) {
	for (let idx = TIME_OFFSET; idx < RANDOM_OFFSET; ++idx) {
		bytes[idx] = _previous_id.bytes[idx];
	}
};

class UlidMonotonic extends Ulid {
	static reset() {
		_previous_time = -1;
		_previous_id = this.MIN();
	}

	//Constructors

	static generate({ time } = {}) {
		time = EpochConverter.toEpoch(EPOCH_ORIGIN_MS, time);
		let bytes = ByteArray.generateRandomFilled();

		if (time <= _previous_time) {
			restoreClockSequence(bytes);
			incrementClockSequence(bytes);
		} else {
			setTime(time, bytes)
			reserveClockSequence(bytes);
			_previous_time = time;
		}

		return (_previous_id = new this(bytes));
	}
}

UlidMonotonic.reset();

module.exports = { UlidMonotonic };
