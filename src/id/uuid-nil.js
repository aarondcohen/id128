'use strict';

const ByteArray = require('../common/byte-array');
const {
	Uuid,
	setVariant,
	setVersion,
} = require('./uuid');

class UuidNil extends Uuid {
	static generate() {
		let bytes = ByteArray.generateZeroFilled();

		setVariant(0, bytes);
		setVersion(0, bytes);

		return new this(bytes);
	}

	static MIN() {
		let bytes = ByteArray.generateZeroFilled();

		setVariant(0, bytes);
		setVersion(0, bytes);

		return new this(bytes);
	}

	static MAX() {
		let bytes = ByteArray.generateZeroFilled();

		setVariant(0, bytes);
		setVersion(0, bytes);

		return new this(bytes);
	}
}

module.exports = { UuidNil };
