'use strict';

const Crockford32Coder = require('../coder/crockford32');
const HexCoder = require('../coder/hex');
const Ulid = require('../id/ulid');

class UlidFactory {

	//Generators

	generate(time) {
		if (Number.isInteger(time)) {
			time = new Date(time);
		}
		else if (time === null || time === void(null)) {
			time = new Date();
		}

		return Ulid.generate(time);
	}

	MIN() {
		return this._MIN = this._MIN || Ulid.MIN();
	}

	MAX() {
		return this._MAX = this._MAX || Ulid.MAX();
	}

	// Coders

	fromCanonical(canonical) {
		return new Ulid(Crockford32Coder.decode(canonical));
	}

	fromRaw(raw) {
		return new Ulid(HexCoder.decode(raw));
	}

	toCanonical(ulid) {
		return Crockford32Coder.encode(ulid.bytes);
	}

	toRaw(ulid) {
		return HexCoder.encode(ulid.bytes);
	}

	// Comparators

	compare(lhs, rhs) {
		return lhs.compare(rhs);
	}

	equal(lhs, rhs) {
		return lhs.equal(rhs);
	}
}

module.exports = new UlidFactory;
