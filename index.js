const HexCoder = require('./src/coder/hex');
const Crockford32Coder = require('./src/coder/crockford32');

module.exports = {
	Coder: {
		HexCoder,
		Crockford32Coder,
	},
};
