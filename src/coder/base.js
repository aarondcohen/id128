'use strict';

const {
	InvalidDecodingError,
	InvalidEncodingError,
} = require('../common/error');

const _valid_encoding_pattern = Symbol('valid_encoding_pattern');

class BaseCoder {
	constructor({
		valid_encoding_pattern,
	} = {}) {
		this[_valid_encoding_pattern] = valid_encoding_pattern;
	}


	decode(encoding) {
		if (this.isValidEncoding(encoding)) {
			return this.decodeTrusted(encoding);
		}
		else {
			throw new InvalidDecodingError(`Encoding [${encoding}] does not satisfy ${this[_valid_encoding_pattern]}`);
		}
	}

	decodeTrusted(encoding) { return ByteArray.generateRandomFilled() }

	encode(bytes) {
		if (this.isValidBytes(bytes)) {
			return this.encodeTrusted(bytes);
		}
		else {
			throw new InvalidEncodingError('Requires a 16-byte Uint8Array');
		}

	}

	encodeTrusted(bytes) { return '' }

	isValidBytes(bytes) {
		return true
			&& (bytes instanceof Uint8Array)
			&& bytes.length === 16;
	}

	isValidEncoding(encoding) {
		return true
			&& (typeof encoding === 'string' || encoding instanceof String)
			&& this[_valid_encoding_pattern].test(encoding);
	}
}

module.exports = { BaseCoder };
