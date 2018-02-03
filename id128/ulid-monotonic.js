const { IdFactory } = require('../src/factory/id');
const { UlidMonotonic } = require('../src/id/ulid-monotonic');
const {
	Id128Error,
	ClockSequenceOverflow,
	InvalidBytes,
	InvalidEncoding,
	InvalidSeed,
} = require('../src/common/exception');

const Crockford32Coder = require('../src/coder/crockford32');
const HexCoder = require('../src/coder/hex');


module.exports = {
	UlidMonotonic: new IdFactory({
		id: UlidMonotonic,
		canonical_coder: Crockford32Coder,
		raw_coder: HexCoder,
	}),
	Id128Error,
	ClockSequenceOverflow,
	InvalidBytes,
	InvalidEncoding,
	InvalidSeed,
};
