const Crypto = require('crypto');

const MAX_BUFFER = 512;
const MAX_BYTES = 16;

let buffer;
let offset = MAX_BUFFER;

class ByteArray {
	compare(lhs, rhs) {
		const mismatch_idx =
			lhs.findIndex((byt, idx) => (byt !== rhs[idx]));
		return ~mismatch_idx
			&& Math.sign(lhs[mismatch_idx] - rhs[mismatch_idx]);
	}

	generateOneFilled() {
		return new Uint8Array(MAX_BYTES).fill(0xFF);
	}

	generateRandomFilled() {
		if (offset >= MAX_BUFFER) {
			offset = 0;
			buffer = Crypto.randomBytes(MAX_BUFFER);
		}

		return buffer.slice(offset, offset += MAX_BYTES);
	}

	generateZeroFilled() {
		return new Uint8Array(MAX_BYTES).fill(0);
	}
}

module.exports = new ByteArray;
