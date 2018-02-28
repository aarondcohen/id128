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
	Coder: {
		Crockford32: Crockford32Coder,
		Hex: HexCoder,
		Uuid: UuidCoder,
	},
	Exception,
	Id: {
		Ulid,
		UlidMonotonic,
		Uuid1,
		Uuid4,
		UuidNil,
	},
	IdFactory,
};
