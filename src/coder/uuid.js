'use strict';

const HexCoder = require('./hex');
const { InvalidDecodingError } = require('./error');

class UuidCoder {
	decode(encoding) {
		try {
			return HexCoder.decode(encoding.replace(/-/g, ''));
		} catch(error) {
			if (error instanceof TypeError|InvalidDecodingError) {
				throw new InvalidDecodingError('Requires a 32-character hex string with optional hyphens');
			}
		}
	}

	encode(bytes) {
		const encoding = HexCoder.encode(bytes);

		return [
			encoding.substr(0, 8),
			encoding.substr(8, 4),
			encoding.substr(12, 4),
			encoding.substr(16, 4),
			encoding.substr(20),
		].join('-');
	}
}

module.exports = new UuidCoder;

