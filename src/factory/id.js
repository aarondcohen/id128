'use strict';

const _id = Symbol('id');
const _canonical_coder = Symbol('canonical_coder');
const _raw_coder = Symbol('raw_coder');

class IdFactory {
	constructor({
		id,
		canonical_coder,
		raw_coder,
	} = {}) {
		this[_id] = class extends id {
			static get name() { return id.name; }
			static get [Symbol.species]() { return id; }
			get [Symbol.toStringTag]() { return `${id.name} ${this.toRaw()}`; }
			toCanonical() { return canonical_coder.encodeTrusted(this.bytes); }
			toRaw() { return raw_coder.encodeTrusted(this.bytes); }
		};
		this[_canonical_coder] = canonical_coder;
		this[_raw_coder] = raw_coder;
	}

	// Properties

	get name() { return this[_id].name }

	// Generators

	construct(bytes) {
		return new this[_id](bytes);
	}

	generate() {
		return this[_id].generate(...arguments);
	}

	MIN() {
		return this[_id].MIN(...arguments);
	}

	MAX() {
		return this[_id].MAX(...arguments);
	}

	// Coders

	fromCanonical(canonical) {
		return this.construct(this[_canonical_coder].decode(canonical));
	}

	fromCanonicalTrusted(canonical) {
		return this.construct(this[_canonical_coder].decodeTrusted(canonical));
	}

	fromRaw(raw) {
		return this.construct(this[_raw_coder].decode(raw));
	}

	fromRawTrusted(raw) {
		return this.construct(this[_raw_coder].decodeTrusted(raw));
	}

	toCanonical(id) {
		return this[_canonical_coder].encode(id.bytes);
	}

	toRaw(id) {
		return this[_raw_coder].encode(id.bytes);
	}

	// Comparators

	compare(lhs, rhs) {
		return lhs.compare(rhs);
	}

	equal(lhs, rhs) {
		return lhs.equal(rhs);
	}

	// Verifiers

	isCanonical(canonical) {
		return this[_canonical_coder].isValidEncoding(canonical);
	}

	isRaw(raw) {
		return this[_raw_coder].isValidEncoding(raw);
	}
}

module.exports = { IdFactory };
