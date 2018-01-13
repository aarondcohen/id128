'use strict';

const ID = Symbol('id');
const CANONICAL_CODER = Symbol('canonical_coder');
const MAX = Symbol('max');
const MIN = Symbol('min');
const RAW_CODER = Symbol('raw_coder');

const injectCoders = (factory, id) => {
	return Object.defineProperties(id, {
		toCanonical: { value: () => factory.toCanonical(id) },
		toRaw: { value: () => factory.toRaw(id) },
	});
};

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
		return injectCoders(this, this[ID].generate(...arguments));
	}

	MIN() {
		return this[MIN] = this[MIN] || injectCoders(this, this[ID].MIN());
	}

	MAX() {
		return this[MAX] = this[MAX] || injectCoders(this, this[ID].MAX());
	}

	// Coders

	fromCanonical(canonical) {
		return injectCoders(this, new this[ID](this[CANONICAL_CODER].decode(canonical)));
	}

	fromRaw(raw) {
		return injectCoders(this, new this[ID](this[RAW_CODER].decode(raw)));
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
