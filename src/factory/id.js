'use strict';

const ID = Symbol('id');
const CANONICAL_CODER = Symbol('canonical_coder');
const MAX = Symbol('max');
const MIN = Symbol('min');
const RAW_CODER = Symbol('raw_coder');

class IdFactory {
	constructor({
		id,
		canonical_coder,
		raw_coder,
	} = {}) {
		this[ID] = id;
		this[CANONICAL_CODER] = canonical_coder;
		this[RAW_CODER] = raw_coder;
	}

	//Generators

	generate() {
		return this[ID].generate(...arguments);
	}

	MIN() {
		return this[MIN] = this[MIN] || this[ID].MIN();
	}

	MAX() {
		return this[MAX] = this[MAX] || this[ID].MAX();
	}

	// Coders

	fromCanonical(canonical) {
		return new this[ID](this[CANONICAL_CODER].decode(canonical));
	}

	fromRaw(raw) {
		return new this[ID](this[RAW_CODER].decode(raw));
	}

	toCanonical(id) {
		return this[CANONICAL_CODER].encode(id.bytes);
	}

	toRaw(id) {
		return this[RAW_CODER].encode(id.bytes);
	}

	// Comparators

	compare(lhs, rhs) {
		return lhs.compare(rhs);
	}

	equal(lhs, rhs) {
		return lhs.equal(rhs);
	}
}

module.exports = { IdFactory };
