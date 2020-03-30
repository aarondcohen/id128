'use strict';

const ByteArray = require('../common/byte-array');

const _bytes = Symbol('bytes');

class BaseId {
	//Constructors

	constructor(bytes) {
		this[_bytes] = bytes;
	}

	clone() {
		return new this.constructor(this.bytes.slice());
	}

	// Accessors

	get bytes() {
		return this[_bytes];
	}

	get [Symbol.toStringTag]() {
		return this.constructor.name;
	}

	// Comparators

	compare(rhs) {
		return ByteArray.compare(this.bytes, rhs.bytes);
	}

	equal(rhs) {
		return this.compare(rhs) === 0;
	}
}

module.exports = { BaseId };
