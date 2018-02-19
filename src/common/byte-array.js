const { randomBytes } = require('./random-bytes');

const MAX_BYTES = 16;

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
		return randomBytes(MAX_BYTES);
	}

	generateZeroFilled() {
		return new Uint8Array(MAX_BYTES).fill(0);
	}
}

module.exports = new ByteArray;
