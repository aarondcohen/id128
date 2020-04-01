'use strict';

const { expect } = require('chai');
const { UnsupportedVersion } = require('common/exception');

const { VersionedIdFactory: described_class } = require('factory/versioned-id');

const buildIdClass = (version) => class {
	static get VERSION() { return version }
	static generate() { return new this(`id_${Date.now()} vrsn:${this.VERSION}`) }
	static MIN() { return new this(`\x00 vrsn:${this.VERSION}`) }
	static MAX() { return new this(`\xFF vrsn:${this.VERSION}`) }
	constructor(value) { this._bytes = value }
	get bytes() { return this._bytes }
	get version() { return /vrsn:(\w+)/.exec(this._bytes)[1] }
};

const version = 'VER';
const abstract_id_class = buildIdClass(undefined);
const versioned_id_class = buildIdClass(version);
const versioned_id_classes = [
	buildIdClass('OTHER1'),
	versioned_id_class,
	buildIdClass('OTHER2'),
];

const factory = new described_class({
	abstract_id: abstract_id_class,
	versioned_ids: versioned_id_classes,
	canonical_coder: {
		encode: (bytes) => `canonical ${bytes}`,
		encodeTrusted: (bytes) => `canonical ${bytes}`,
		decode: (str) => str.replace(/^canonical(?:_distrusted)? /, ''),
		decodeTrusted: (str) => str.replace(/^canonical /, ''),
	},
	raw_coder: {
		encode: (bytes) => `raw ${bytes}`,
		encodeTrusted: (bytes) => `raw ${bytes}`,
		decode: (str) => str.replace(/^raw(?:_distrusted)? /, ''),
		decodeTrusted: (str) => str.replace(/^raw /, ''),
	},
});

function assertDecoder(method, encoding) {
	describe(`#${method}`, function() {
		const subject = () => factory[method](encoding);

		it('returns a versioned id', function() {
			expect(subject()).to.be.an.instanceOf(versioned_id_class);
		});

		it('returns an abstract id when the version is unsupported', function() {
			expect(factory[method](encoding.replace(version, 'IDUNNO')))
				.to.be.an.instanceOf(abstract_id_class);
		});

		assertInjectsInstanceMethod('toCanonical', subject);
		assertInjectsInstanceMethod('toRaw', subject);
	});
}

function assertEncoder(method, pattern) {
	describe(`#${method}`, function() {
		const subject = () => factory[method](factory.generate({ version }));

		it('encodes the bytes of the id', function() {
			expect(subject()).to.match(pattern);
		});
	});
}

function assertGenerator(method) {
	describe(`#${method}`, function() {
		const subject = () => factory[method]({ version });

		it(`returns a versioned id`, function() {
			expect(subject()).to.be.an.instanceOf(versioned_id_class);
		});

		it('always returns a different object', function() {
			expect(subject()).not.to.equal(subject());
		});

		it('throws without a version', function() {
			expect(() => factory[method]()).to.throw(UnsupportedVersion);
		});

		assertInjectsInstanceMethod('toCanonical', subject);
		assertInjectsInstanceMethod('toRaw', subject);
	});
}

function assertInjectsInstanceMethod(injected_method, generator) {
	describe(injected_method, function() {
		it(`is injected into the instance`, function() {
			const id = generator();

			expect(() => id[injected_method]()).not.to.throw();
			expect(id[injected_method]()).to.equal(factory[injected_method](id));
		});

		it('is only injected into the instance', function() {
			const id = generator();

			expect(new versioned_id_class()[injected_method]).to.be.undefined;
		});
	});
}

describe(described_class.name, function() {
	describe('#construct', function() {
		const subject = () => factory.construct(`some bytes vrsn:${version}`);

		it('returns a versioned id', function() {
			expect(subject()).to.be.an.instanceOf(versioned_id_class);
		});

		it('directly stores the bytes', function() {
			expect(subject()).to.have.property('bytes', `some bytes vrsn:${version}`);
		});

		it('returns an abstract id when the version is unsupported', function() {
			expect(factory.construct('some bytes vrsn:IDUNNO'))
				.to.be.an.instanceOf(abstract_id_class);
		});
	});

	describe('#name', function() {
		const subject = () => factory.name;

		it('returns the name of the abstract id for the factory', function() {
			expect(subject()).to.equal(abstract_id_class.name);
		});
	});

	describe('#versioned_ids', function() {
		const subject = () => factory.versioned_ids;

		it('returns all the versioned id classes the factory can generate', function() {
			expect(subject().map(id => id.name))
				.to.have.members(versioned_id_classes.map(id => id.name));
		});
	});

	assertGenerator('generate');
	assertGenerator('MIN');
	assertGenerator('MAX');

	assertDecoder('fromCanonical', `canonical_distrusted some_id vrsn:${version}`);
	assertDecoder('fromCanonicalTrusted', `canonical some_id vrsn:${version}`);
	assertDecoder('fromRaw', `raw_distrusted some_id vrsn:${version}`);
	assertDecoder('fromRawTrusted', `raw some_id vrsn:${version}`);

	assertEncoder('toCanonical', new RegExp(`^canonical id_\\d+ vrsn:${version}$`));
	assertEncoder('toRaw', new RegExp(`^raw id_\\d+ vrsn:${version}$`));
});


