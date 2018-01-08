'use strict';

const expect = require('chai').expect;

const { Ulid } = require('../');

describe('Ulid', function() {
	const id = Ulid.generate();

	describe('new', function() {
		it('is disabled', function() {
			expect(() => new Ulid).to.throw(TypeError);
		});
	});

	describe('.generate', function() {
		it('generates a new id', function() {
			const other = Ulid.generate();

			expect(other.bytes).not.to.deep.equal(id.bytes);
			expect(other.equal(id)).to.be.false;
		});

		it('generates 128-bit id', function() {
			expect(id.bytes).to.have.lengthOf(16);
		});
	});

	describe('canonical', function() {
		it('encodes to a string', function() {
			expect(Ulid.toCanonical(id)).to.be.a('string');
		});

		it('decodes to a Ulid', function() {
			expect(Ulid.fromCanonical(Ulid.toCanonical(id)))
				.to.be.an.instanceOf(id.constructor);
		});

		it('converts symmetrically', function() {
			expect(Ulid.fromCanonical(Ulid.toCanonical(id)))
				.to.deep.equal(id);
		});
	});

	describe('raw', function() {
		it('encodes to a string', function() {
			expect(Ulid.toRaw(id)).to.be.a('string');
		});

		it('decodes to a Ulid', function() {
			expect(Ulid.fromRaw(Ulid.toRaw(id)))
				.to.be.an.instanceOf(id.constructor);
		});

		it('converts symmetrically', function() {
			expect(Ulid.fromRaw(Ulid.toRaw(id)))
				.to.deep.equal(id);
		});
	});
});
