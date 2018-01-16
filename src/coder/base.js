'use strict';

const {
	InvalidDecodingError,
	InvalidEncodingError,
} = require('../common/error');

const _decoding_error_message = Symbol('decoding_error_message');
const _valid_encoding_pattern = Symbol('valid_encoding_pattern');

class BaseCoder {
	constructor({
		decoding_error_message,
		valid_encoding_pattern,
	} = {}) {
		this[_decoding_error_message] = decoding_error_message;
		this[_valid_encoding_pattern] = valid_encoding_pattern;
	}

	decode(encoding) {
		if (this.isValidEncoding(encoding)) {
			return this._decode(encoding);
		}
		else {
			throw new InvalidDecodingError(this[_decoding_error_message]);
		}
	}

	encode(bytes) {
		if (this.isValidBytes(bytes)) {
			return this._encode(bytes);
		}
		else {
			throw new InvalidEncodingError('Requires a 16-byte Uint8Array');
		}

	}

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
