'use strict';

const ByteArray = require('../common/byte-array');
const {
	Uuid,
	setVariant,
	setVersion,
} = require('./uuid');

class Uuid4 extends Uuid {
	static generate() {
		let bytes = ByteArray.generateRandomFilled();

		setVariant(1, bytes);
		setVersion(4, bytes);

		return new this(bytes);
	}

	static MIN() {
		let bytes = ByteArray.generateZeroFilled();

		setVariant(1, bytes);
		setVersion(4, bytes);

		return new this(bytes);
	}

	static MAX() {
		let bytes = ByteArray.generateOneFilled();

		setVariant(1, bytes);
		setVersion(4, bytes);

		return new this(bytes);
	}
}

module.exports = { Uuid4 };
