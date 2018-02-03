const { IdFactory } = require('../src/factory/id');
const { UuidNil } = require('../src/id/uuid-nil');
const {
	Id128Error,
	InvalidBytes,
	InvalidEncoding,
} = require('../src/common/exception');

const HexCoder = require('../src/coder/hex');
const UuidCoder = require('../src/coder/uuid');

module.exports = {
	UuidNil: new IdFactory({
		id: UuidNil,
		canonical_coder: UuidCoder,
		raw_coder: HexCoder,
	}),
	Id128Error,
	InvalidBytes,
	InvalidEncoding,
};
