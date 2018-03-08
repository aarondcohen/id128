'use strict';

const { IdFactory } = require('./id');
const { UnsupportedVersion } = require('../common/exception');

const _id_by_version = Symbol('id_by_version');

function detect(factory, { version } = {}) {
	return factory[_id_by_version][version]
		|| (() => { throw new UnsupportedVersion(
			`No support for version [${version}]`
		) })();
}

class VersionedIdFactory extends IdFactory {
	constructor({
		abstract_id,
		versioned_ids,
		canonical_coder,
		raw_coder,
	}) {
		super({
			id: abstract_id,
			canonical_coder,
			raw_coder,
		});

		this[_id_by_version] = versioned_ids.reduce(
			(mapping, id) => Object.assign(mapping, {
				[id.MIN().version]: new IdFactory({
					id,
					canonical_coder,
					raw_coder,
				})
			}),
			Object.create(null),
		);
	}

	get versioned_ids() {
		return Object.values(this[_id_by_version]);
	}

	// Generators

	construct(bytes) {
		const id = super.construct(bytes);
		const version = id.version;

		try {
			return detect(this, { version }).construct(bytes);
		}
		catch (error) {
			if (error instanceof UnsupportedVersion) { return id }
			else { throw error }
		}
	}

	generate() {
		return detect(this, ...arguments).generate(...arguments);
	}

	MIN() {
		return detect(this, ...arguments).MIN();
	}

	MAX() {
		return detect(this, ...arguments).MAX();
	}
}

module.exports = { VersionedIdFactory };
