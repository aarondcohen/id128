'use strict';

const { BaseCoder } = require('./base');

const ALPHABET = '0123456789ABCDEF';

const BYTE_TO_HEX = Array
	.from({ length: ALPHABET.length * ALPHABET.length })
	.map((_, key) => (
		''
		+ ALPHABET.charAt(key / ALPHABET.length)
		+ ALPHABET.charAt(key % ALPHABET.length)
	));

const HEX_TO_BYTE = Array.from(ALPHABET).reduce(
	(mapping, hex, idx) => Object.assign(mapping, {
		[hex.toUpperCase()]: idx,
		[hex.toLowerCase()]: idx,
	}),
	Object.create(null)
);

class HexCoder extends BaseCoder {
	constructor() {
		super({
			valid_encoding_pattern: /^[0-9A-Fa-f]{32}$/,
		});
	}

	decodeTrusted(encoding) {
		let bytes = new Uint8Array(16);

		let dst = 0;
		let hi_hex = true;
		for (let hex of encoding) {
			if (hi_hex) {
				bytes[dst] = HEX_TO_BYTE[hex] << 4;
			} else {
				bytes[dst++] |= HEX_TO_BYTE[hex];
			}
			hi_hex = !hi_hex;
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
