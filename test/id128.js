'use strict';

const { expect } = require('chai');

const Id128 = require('../');
const { Id } = require('../utils');

function assertDebuggable(id_name, generator) {
	describe('when cast as a string', function() {
		const subject = () => '' + generator();

		it(`mentions the type ${id_name}`, function() {
			expect(subject()).to.contain.string(id_name);
		});
	});
}

function assertValidId128(id_name, factory, id_class) {
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

			it('generates 128-bit id', function() {
				expect(subject().bytes).to.have.lengthOf(16);
			});

			assertDebuggable(id_name, subject);
		});

		describe('.MIN', function() {
			const subject = () => factory.MIN();

			it(`returns a ${id_name}`, function() {
				expect(subject()).to.be.an.instanceof(id_class);
			});

			it('generates 128-bit id', function() {
				expect(subject().bytes).to.have.lengthOf(16);
			});

			assertDebuggable(id_name, subject);
		});

		describe('.MAX', function() {
			const subject = () => factory.MAX();

			it(`returns a ${id_name}`, function() {
				expect(subject()).to.be.an.instanceof(id_class);
			});

			it('generates 128-bit id', function() {
				expect(subject().bytes).to.have.lengthOf(16);
			});

			assertDebuggable(id_name, subject);
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

			describe('when decoded', function() {
				assertDebuggable(id_name, () => factory.fromCanonical(id.toCanonical()));
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

			describe('when decoded', function() {
				assertDebuggable(id_name, () => factory.fromRaw(id.toRaw()));
			});
		});
	});
}

[
	'Ulid',
	'UlidMonotonic',
	'Uuid4',
	'UuidNil',
].forEach((id_name) => assertValidId128(
	id_name,
	Id128[id_name],
	Id[id_name],
));

