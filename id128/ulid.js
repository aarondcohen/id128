const { IdFactory } = require('../src/factory/id');
const { Ulid } = require('../src/id/ulid');
const {
	Id128Error,
	InvalidBytes,
	InvalidEncoding,
	InvalidSeed,
} = require('../src/common/exception');

const Crockford32Coder = require('../src/coder/crockford32');
const HexCoder = require('../src/coder/hex');

module.exports = {
	Ulid: new IdFactory({
		id: Ulid,
		canonical_coder: Crockford32Coder,
		raw_coder: HexCoder,
	}),
	Id128Error,
	InvalidBytes,
	InvalidEncoding,
	InvalidSeed,
};
