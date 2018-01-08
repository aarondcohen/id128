const Crypto = require('crypto');

class ByteArray {
	compare(lhs, rhs) {
		const mismatch_idx =
			lhs.findIndex((byt, idx) => (byt !== rhs[idx]));
		return ~mismatch_idx
			&& Math.sign(lhs[mismatch_idx] - rhs[mismatch_idx]);
	}

	generate() {
		return new Uint8Array(16);
	}

	generateOneFilled() {
		return this.generate().fill(0xFF);
	}

	generateRandomFilled() {
		let bytes = this.generate();

		bytes.set(Crypto.randomBytes(bytes.length));

		return bytes;
	}

	generateZeroFilled() {
		return this.generate().fill(0);
	}
}

module.exports = new ByteArray;
