const Ulid = require('./src/id/ulid');
const Uuid4 = require('./src/id/uuid4');
const UuidNil = require('./src/id/uuid-nil');

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
	UuidNil: new IdFactory({
		id: UuidNil,
		canonical_coder: UuidCoder,
		raw_coder: HexCoder,
	}),
	Coder: {
		Crockford32: Crockford32Coder,
		Hex: HexCoder,
		Uuid: UuidCoder,
	},
	Id: {
		Ulid,
		Uuid4,
		UuidNil,
	},
};
