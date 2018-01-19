'use strict';

const { BaseCoder } = require('./base');

const BYTE_TO_HEX = Array
	.from({length: 256})
	.map((val, key) => (0x100 + key).toString(16).substr(1).toUpperCase());

const HEX_TO_BYTE = BYTE_TO_HEX.reduce(
	(mapping, hex, idx) => Object.assign(mapping, { [hex]: idx }),
	Object.create(null)
);

class HexCoder extends BaseCoder {
	constructor() {
		super({
			valid_encoding_pattern: /^[0-9A-Fa-f]{32}$/,
		});
	}

	decodeTrusted(encoding) {
		const normalized_encoding = encoding.toUpperCase();
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

	encodeTrusted(bytes) {
		let encoding = '';
		for (let byt of bytes) { encoding += BYTE_TO_HEX[byt] };
		return encoding;
	}
}

module.exports = new HexCoder;
