const { Ulid } = require('./src/id/ulid');
const { UlidMonotonic } = require('./src/id/ulid-monotonic');
const { Uuid1 } = require('./src/id/uuid-1');
const { Uuid4 } = require('./src/id/uuid-4');
const { UuidNil } = require('./src/id/uuid-nil');

const Crockford32Coder = require('./src/coder/crockford32');
const HexCoder = require('./src/coder/hex');
const UuidCoder = require('./src/coder/uuid');

const { IdFactory } = require('./src/factory/id');
const Exception = require('./src/common/exception');

module.exports = {
	Ulid: new IdFactory({
		id: Ulid,
		canonical_coder: Crockford32Coder,
		raw_coder: HexCoder,
	}),
	UlidMonotonic: new IdFactory({
		id: UlidMonotonic,
		canonical_coder: Crockford32Coder,
		raw_coder: HexCoder,
	}),
	Uuid1: new IdFactory({
		id: Uuid1,
		canonical_coder: UuidCoder,
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
	Exception,
};
