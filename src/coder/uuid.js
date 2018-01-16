'use strict';

const { BaseCoder } = require('./base');

const BYTE_TO_HEX = Array
	.from({length: 256})
	.map((val, key) => (0x100 + key).toString(16).substr(1).toUpperCase());

const HEX_TO_BYTE = BYTE_TO_HEX.reduce(
	(mapping, hex, idx) => Object.assign(mapping, { [hex]: idx }),
	Object.create(null)
);

class UuidCoder extends BaseCoder {
	constructor() {
		super({
			decoding_error_message: 'Requires a 32-character hex string with optional hyphens',
			valid_encoding_pattern: /^[0-9A-Fa-f]{4}(?:-?[0-9A-Fa-f]{4}){7}$/,
		});
	}

	_decode(encoding) {
		const normalized_encoding = encoding.replace(/-/g, '').toUpperCase();
		let bytes = new Uint8Array(16);

		for (
			let dst=0, src=0, len=bytes.length;
			dst < len;
			dst += 1, src += 2
		) {
			bytes[dst] = HEX_TO_BYTE[normalized_encoding.substr(src, 2)];
		}

		return bytes;
	}

	_encode(bytes) {
		return (
			BYTE_TO_HEX[bytes[0]] + BYTE_TO_HEX[bytes[1]] +
			BYTE_TO_HEX[bytes[2]] + BYTE_TO_HEX[bytes[3]] +
			'-' +
			BYTE_TO_HEX[bytes[4]] + BYTE_TO_HEX[bytes[5]] +
			'-' +
			BYTE_TO_HEX[bytes[6]] + BYTE_TO_HEX[bytes[7]] +
			'-' +
			BYTE_TO_HEX[bytes[8]] + BYTE_TO_HEX[bytes[9]] +
			'-' +
			BYTE_TO_HEX[bytes[10]] + BYTE_TO_HEX[bytes[11]] +
			BYTE_TO_HEX[bytes[12]] + BYTE_TO_HEX[bytes[13]] +
			BYTE_TO_HEX[bytes[14]] + BYTE_TO_HEX[bytes[15]]
		);
	}
}

module.exports = new UuidCoder;

