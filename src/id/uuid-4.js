'use strict';

const ByteArray = require('../common/byte-array');
const {
	Uuid,
	setVariant,
	setVersion,
} = require('./uuid');

class Uuid4 extends Uuid {
	static get VARIANT() { return 1 }
	static get VERSION() { return 4 }

	static generate() {
		let bytes = ByteArray.generateRandomFilled();

		setVariant(this.VARIANT, bytes);
		setVersion(this.VERSION, bytes);

		return new this(bytes);
	}
}

module.exports = { Uuid4 };
