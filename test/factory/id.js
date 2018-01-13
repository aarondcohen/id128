'use strict';

const { expect } = require('chai');

const { IdFactory: described_class } = require('factory/id');

function assertInjectedFunctions(factory, id_class, generator) {
	[
		'toCanonical',
		'toRaw',
	].forEach((injected_function) => {
		describe(injected_function, function() {
			it('is injected into the returned instance', function() {
				const id = generator();

				expect(() => id[injected_function]()).not.to.throw();
				expect(id[injected_function]()).to.equal(factory[injected_function](id));
			});

			it('is only injected into the returned instance', function() {
				const id = generator();

				expect(new id_class()[injected_function]).to.be.undefined;
			});
		})
	});
}

describe(described_class.name, function() {
	const id_class = class {
		static generate() { return new this(`id_${Date.now()}`) }
		static MIN() { return new this('\x00') }
		static MAX() { return new this('\xFF') }
		constructor(value) { this._bytes = value }
		get bytes() { return this._bytes }
	};

	const factory = new described_class({
		id: id_class,
		canonical_coder: {
			encode: (bytes) => `can ${bytes}`,
			decode: (str) => str.replace(/^can /, ''),
		},
		raw_coder: {
			encode: (bytes) => `raw ${bytes}`,
			decode: (str) => str.replace(/^raw /, ''),
		},
	});

	describe('#generate', function() {
		const subject = () => factory.generate();

		it(`returns an id`, function() {
			expect(subject()).to.be.an.instanceof(id_class);
		});

		it('always returns a different object', function() {
			expect(subject()).not.to.equal(subject());
		});

		assertInjectedFunctions(factory, id_class, subject);
	});

	describe('#MIN', function() {
		const subject = () => factory.MIN();

		it(`returns an id `, function() {
			expect(subject()).to.be.an.instanceof(id_class);
		});

		it('always returns the same object', function() {
			expect(subject()).to.equal(subject());
		});

		assertInjectedFunctions(factory, id_class, subject);
	});

	describe('#MAX', function() {
		const subject = () => factory.MAX();

		it(`returns an id `, function() {
			expect(subject()).to.be.an.instanceof(id_class);
		});

		it('always returns the same object', function() {
			expect(subject()).to.equal(subject());
		});

		assertInjectedFunctions(factory, id_class, subject);
	});

	describe('#fromCanonical', function() {
		const subject = () => factory.fromCanonical('can some_id');

		it(`returns an id `, function() {
			expect(subject()).to.be.an.instanceof(id_class);
		});

		assertInjectedFunctions(factory, id_class, subject);
	});

	describe('#fromRaw', function() {
		const subject = () => factory.fromRaw('raw some_id');

		it(`returns an id `, function() {
			expect(subject()).to.be.an.instanceof(id_class);
		});

		assertInjectedFunctions(factory, id_class, subject);
	});

	describe('#toCanonical', function() {
		const subject = () => factory.toCanonical(factory.generate());

		it('canonical encodes the bytes of the id', function() {
			expect(subject()).to.match(/^can id_\d+$/);
		});
	});

	describe('#toRaw', function() {
		const subject = () => factory.toRaw(factory.generate());

		it('raw encodes the bytes of the id', function() {
			expect(subject()).to.match(/^raw id_\d+$/);
		});
	});
});

