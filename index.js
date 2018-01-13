const Ulid = require('./src/id/ulid');
const Uuid4 = require('./src/id/uuid4');

const Crockford32Coder = require('./src/coder/crockford32');
const HexCoder = require('./src/coder/hex');
const UuidCoder = require('./src/coder/uuid');

const IdFactory = require('./src/factory/id');

module.exports = {
	Ulid: new IdFactory({
		id: Ulid,
		canonical_coder: Crockford32Coder,
		raw_coder: HexCoder,
	}),
	Uuid4: new IdFactory({
		id: Uuid4,
		canonical_coder: UuidCoder,
		raw_coder: HexCoder,
	}),
	Coder: {
		Crockford32Coder,
		HexCoder,
		UuidCoder,
	},
	Id: {
		Ulid,
		Uuid4,
	},
};
