const ByteArray = require('../common/byte-array');
const { Ulid } = require('./ulid');
const { ClockSequenceOverflow } = require('../common/exception');

const CLOCK_SEQUENCE_OFFSET = 6;
const RANDOM_OFFSET = 8;

let _previous_id;
let _previous_time;

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

	throw new ClockSequenceOverflow('Exhausted clock sequence');
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
		time = id.time;

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
		_previous_time = new Date(-1);
		_previous_id = this.MIN();
	}
}

UlidMonotonic.resetClockSequence();

module.exports = { UlidMonotonic };
