'use strict';

const ByteArray = require('../common/byte-array');
const BaseId = require('./base');

const VARIANT_BYTE = 8;
const VERSION_BYTE = 6;

const _setVariant = (bytes) => {
	bytes[VARIANT_BYTE] &= 0b00111111;
	bytes[VARIANT_BYTE] |= 0b10000000;
};

const _setVersion = (version, bytes) => {
	bytes[VERSION_BYTE] &= 0b00001111;
	bytes[VERSION_BYTE] |= version << 4;
};

class Uuid extends BaseId {
	static generate() {
		let bytes = ByteArray.generateRandomFilled();

		_setVariant(bytes);
		_setVersion(4, bytes);

		return new this(bytes);
	}

	static MIN() {
		let bytes = ByteArray.generateZeroFilled();

		_setVariant(bytes);
		_setVersion(4, bytes);

		return new this(bytes);
	}

	static MAX() {
		let bytes = ByteArray.generateOneFilled();

		_setVariant(bytes);
		_setVersion(4, bytes);

		return new this(bytes);
	}

	get variant() {
		const bits = this.bytes[VARIANT_BYTE] >>> 5;

		return (
			bits === 0b111 ? 3 :
			(bits & 0b110) === 0b110 ? 2 :
			(bits & 0b100) === 0b100 ? 1 :
				0
		);
	}

	get version() {
		return this.bytes[VERSION_BYTE] >>> 4
	}
}

module.exports = Uuid;
