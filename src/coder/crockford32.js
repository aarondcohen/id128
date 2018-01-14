const { InvalidDecodingError, InvalidEncodingError } = require('./error.js');

const ALPHABET = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
const MAX_QUINTET = 0b11111;
const VALID_ENCODING = new RegExp('^[0-7][^\\W_]{25}$');

const CHAR_TO_QUINTET = Array.from(ALPHABET).reduce(
	(acc, chr, idx) => (acc[chr] = acc[chr.toLowerCase()] = idx, acc),
	{
		'I': ALPHABET.indexOf('1'),
		'i': ALPHABET.indexOf('1'),
		'L': ALPHABET.indexOf('1'),
		'l': ALPHABET.indexOf('1'),
		'O': ALPHABET.indexOf('0'),
		'o': ALPHABET.indexOf('0'),
		'U': ALPHABET.indexOf('V'),
		'u': ALPHABET.indexOf('V'),
	}
);
const QUINTET_TO_CHAR = Array.from(ALPHABET);

function _charToQuintet(chr) {
	return CHAR_TO_QUINTET[chr];
}

function _quintetToChar(quintet) {
	return QUINTET_TO_CHAR[quintet & MAX_QUINTET];
}

class Crockford32Coder {
	decode(encoding) {
		if (! this.isValidEncoding(encoding)) {
			throw new InvalidDecodingError('Requires a 26-character Crockford32 string');
		}

		const quintets = Array.from(encoding, _charToQuintet);
		let bytes = new Uint8Array(16);

		//Note: unrolled for performance
		bytes[0] = quintets[0] << 5 | quintets[1];

		bytes[1] = quintets[2] << 3 | quintets[3] >> 2;
		bytes[2] = quintets[3] << 6 | quintets[4] << 1 | quintets[5] >> 4;
		bytes[3] = quintets[5] << 4 | quintets[6] >> 1;
		bytes[4] = quintets[6] << 7 | quintets[7] << 2 | quintets[8] >> 3;
		bytes[5] = quintets[8] << 5 | quintets[9];

		bytes[6] = quintets[10] << 3 | quintets[11] >> 2;
		bytes[7] = quintets[11] << 6 | quintets[12] << 1 | quintets[13] >> 4;
		bytes[8] = quintets[13] << 4 | quintets[14] >> 1;
		bytes[9] = quintets[14] << 7 | quintets[15] << 2 | quintets[16] >> 3;
		bytes[10] = quintets[16] << 5 | quintets[17];

		bytes[11] = quintets[18] << 3 | quintets[19] >> 2;
		bytes[12] = quintets[19] << 6 | quintets[20] << 1 | quintets[21] >> 4;
		bytes[13] = quintets[21] << 4 | quintets[22] >> 1;
		bytes[14] = quintets[22] << 7 | quintets[23] << 2 | quintets[24] >> 3;
		bytes[15] = quintets[24] << 5 | quintets[25];

		return bytes;
	}

	encode(bytes) {
		if (! this.isValidBytes(bytes)) {
			throw new InvalidEncodingError('Requires a 16-byte Uint8Array');
		}

		//Note: unrolled for performance
		let quintets = [
			(bytes[0] >> 5),
			(bytes[0]),

			(bytes[1] >> 3),
			(bytes[1] << 2 | bytes[2] >> 6),
			(bytes[2] >> 1),
			(bytes[2] << 4 | bytes[3] >> 4),
			(bytes[3] << 1 | bytes[4] >> 7),
			(bytes[4] >> 2),
			(bytes[4] << 3 | bytes[5] >> 5),
			(bytes[5]),

			(bytes[6] >> 3),
			(bytes[6] << 2 | bytes[7] >> 6),
			(bytes[7] >> 1),
			(bytes[7] << 4 | bytes[8] >> 4),
			(bytes[8] << 1 | bytes[9] >> 7),
			(bytes[9] >> 2),
			(bytes[9] << 3 | bytes[10] >> 5),
			(bytes[10]),

			(bytes[11] >> 3),
			(bytes[11] << 2 | bytes[12] >> 6),
			(bytes[12] >> 1),
			(bytes[12] << 4 | bytes[13] >> 4),
			(bytes[13] << 1 | bytes[14] >> 7),
			(bytes[14] >> 2),
			(bytes[14] << 3 | bytes[15] >> 5),
			(bytes[15]),
		];

		//Note: Massive performance losses occured when
		// using the more legible Array.map and Array.join
		let encoding = '';
		for (let quintet of quintets) {
			encoding += _quintetToChar(quintet);
		}

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

module.exports = new Crockford32Coder;
