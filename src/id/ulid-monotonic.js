const ByteArray = require('../common/byte-array');
const { Ulid } = require('./ulid');
const { ClockSequenceOverflowError } = require('../common/error');

let _previous_time;
let _previous_id;

const CLOCK_SEQUENCE_OFFSET = 6;
const RANDOM_OFFSET = 8;

const _incrementClockSequence = (id) => {
	const bytes = id.bytes;

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

	throw new ClockSequenceOverflowError;
};

const _reserveClockSequence = (id) => {
	id.bytes[CLOCK_SEQUENCE_OFFSET] &= 0b01111111;
};

const _restoreClockSequence = (id) => {
	id.bytes.set(_previous_id.bytes.subarray(0, RANDOM_OFFSET));
};

class UlidMonotonic extends Ulid {

	//Constructors

	static generate(time) {
		const id = super.generate(time);

		if (time <= _previous_time) {
			_restoreClockSequence(id);
			_incrementClockSequence(id);
		} else {
			_reserveClockSequence(id);
			_previous_time = time;
		}
		_previous_id = id;

		return id;
	}

	static resetClockSequence() {
		_previous_time = -1;
		_previous_id = this.MIN();
	}
}

UlidMonotonic.resetClockSequence();

module.exports = { UlidMonotonic };
