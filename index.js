const Ulid = require('./src/id/ulid');

const Crockford32Coder = require('./src/coder/crockford32');
const HexCoder = require('./src/coder/hex');

const IdFactory = require('./src/factory/id');

module.exports = {
	Ulid: new IdFactory({
		id: Ulid,
		canonical_coder: Crockford32Coder,
		raw_coder: HexCoder,
	}),
	Coder: {
		Crockford32Coder,
		HexCoder,
	},
	Id: {
		Ulid,
	},
};
