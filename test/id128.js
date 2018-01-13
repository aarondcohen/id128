'use strict';

const { expect } = require('chai');

const Id128 = require('../');

function assertValidId128(id_name) {
	const factory = Id128[id_name];
	const id_class = Id128.Id[id_name];

	describe(`${id_name} Factory`, function() {
		describe('new', function() {
			it('is disabled', function() {
				expect(() => new factory).to.throw(TypeError);
			});
		});

		describe('.generate', function() {
			const subject = () => factory.generate();

			it(`returns a ${id_name}`, function() {
				expect(subject()).to.be.an.instanceof(id_class);
			});

			it('always returns a different object', function() {
				expect(subject()).not.to.equal(subject());
			});

			it('generates 128-bit id', function() {
				expect(subject().bytes).to.have.lengthOf(16);
			});
		});

		describe('.MIN', function() {
			const subject = () => factory.MIN();

			it(`returns a ${id_name}`, function() {
				expect(subject()).to.be.an.instanceof(id_class);
			});

			it('always returns the same object', function() {
				expect(subject()).to.equal(subject());
			});

			it('generates 128-bit id', function() {
				expect(subject().bytes).to.have.lengthOf(16);
			});
		});

		describe('.MAX', function() {
			const subject = () => factory.MAX();

			it(`returns a ${id_name}`, function() {
				expect(subject()).to.be.an.instanceof(id_class);
			});

			it('always returns the same object', function() {
				expect(subject()).to.equal(subject());
			});

			it('generates 128-bit id', function() {
				expect(subject().bytes).to.have.lengthOf(16);
			});
		});

		describe('canonical', function() {
			const id = factory.generate();

			it('encodes to a string', function() {
				expect(factory.toCanonical(id)).to.be.a('string');
			});

			it(`decodes to a ${id_name}`, function() {
				expect(factory.fromCanonical(factory.toCanonical(id)))
					.to.be.an.instanceOf(id_class);
			});

			it('converts symmetrically', function() {
				[
					['generated', id],
					['min', factory.MIN()],
					['max', factory.MAX()],
				].forEach(([label, test_id]) => {
					expect(factory.fromCanonical(factory.toCanonical(test_id)), label)
						.to.deep.equal(test_id);
				});
			});
		});

		describe('raw', function() {
			const id = factory.generate();

			it('encodes to a string', function() {
				expect(factory.toRaw(id)).to.be.a('string');
			});

			it(`decodes to a ${id_name}`, function() {
				expect(factory.fromRaw(factory.toRaw(id)))
					.to.be.an.instanceOf(id_class);
			});

			it('converts symmetrically', function() {
				[
					['generated', id],
					['min', factory.MIN()],
					['max', factory.MAX()],
				].forEach(([label, test_id]) => {
					expect(factory.fromRaw(factory.toRaw(test_id)), label)
						.to.deep.equal(test_id);
				});
			});
		});
	});
}

assertValidId128('Ulid');
assertValidId128('Uuid4');
assertValidId128('UuidNil');
