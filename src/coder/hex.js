const { InvalidDecodingError, InvalidEncodingError } = require('../common/error');

const BYTE_TO_HEX = Array
	.from({length: 256})
	.map((val, key) => (0x100 + key).toString(16).substr(1).toUpperCase());

const HEX_TO_BYTE = BYTE_TO_HEX.reduce(
	(mapping, hex, idx) => {
		mapping[hex.toUpperCase()] = idx;
		return mapping;
	},
	Object.create(null)
);

const VALID_ENCODING = new RegExp('^[0-9A-Fa-f]{32}$');

class HexCoder {
	decode(encoding) {
		if (! this.isValidEncoding(encoding)) {
			throw new InvalidDecodingError('Requires a 32-character hex string');
		}

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

	encode(bytes) {
		if (! this.isValidBytes(bytes)) {
			throw new InvalidEncodingError('Requires a 16-byte Uint8Array');
		}

		let encoding = '';
		for (let byt of bytes) { encoding += BYTE_TO_HEX[byt] };
		return encoding;
	}

	isValidBytes(bytes) {
		return true
			&& (bytes instanceof Uint8Array)
			&& bytes.length === 16;
	}

	isValidEncoding(encoding) {
		return true
			&& (typeof encoding === 'string' || encoding instanceof String)
			&& VALID_ENCODING.test(encoding);
	}
}

module.exports = new HexCoder;
