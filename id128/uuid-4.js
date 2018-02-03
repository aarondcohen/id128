const { IdFactory } = require('../src/factory/id');
const { Uuid4 } = require('../src/id/uuid-4');
const {
	Id128Error,
	InvalidBytes,
	InvalidEncoding,
} = require('../src/common/exception');

const HexCoder = require('../src/coder/hex');
const UuidCoder = require('../src/coder/uuid');

module.exports = {
	Uuid4: new IdFactory({
		id: Uuid4,
		canonical_coder: UuidCoder,
		raw_coder: HexCoder,
	}),
	Id128Error,
	InvalidBytes,
	InvalidEncoding,
};
