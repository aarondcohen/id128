'use strict';

const ByteArray = require('../common/byte-array');
const {
	Uuid,
	setVariant,
	setVersion,
} = require('./uuid');

class UuidNil extends Uuid {
	static get VARIANT() { return 0 }
	static get VERSION() { return 0 }

	static generate() {
		let bytes = ByteArray.generateZeroFilled();

		setVariant(this.VARIANT, bytes);
		setVersion(this.VERSION, bytes);

		return new this(bytes);
	}

	static MAX() {
		let bytes = ByteArray.generateZeroFilled();

		setVariant(this.VARIANT, bytes);
		setVersion(this.VERSION, bytes);

		return new this(bytes);
	}
}

module.exports = { UuidNil };
