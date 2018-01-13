'use strict';

const BaseId = require('./base');

const VARIANT_BYTE = 8;
const VERSION_BYTE = 6;

function setVariant(variant, bytes) {
	bytes[VARIANT_BYTE] &= 0b11111111 >>> (variant + 1);
	bytes[VARIANT_BYTE] |= ((0b111 << (3 - variant)) & 0b111) << 5;
};

function setVersion(version, bytes) {
	bytes[VERSION_BYTE] &= 0b00001111;
	bytes[VERSION_BYTE] |= version << 4;
};

class Uuid extends BaseId {
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
		return this.bytes[VERSION_BYTE] >>> 4;
	}
}

module.exports = {
	Uuid,
	setVersion,
	setVariant,
};
