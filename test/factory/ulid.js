'use strict';

const expect = require('chai').expect;

const Ulid = require('id/ulid');
const UlidFactory = require('factory/ulid');

const described_namespace = UlidFactory;
const generated_class = Ulid;

describe(described_namespace.constructor.name, function() {
	describe('new', function() {
		it('is disabled', function() {
			expect(() => new described_namespace).to.throw(TypeError);
		});
	});

	describe('.generate', function() {
		const subject = (time) => described_namespace.generate(time);

		it(`returns a ${generated_class.name}`, function() {
			expect(subject()).to.be.an.instanceof(generated_class);
		});

		it('always returns a different object', function() {
			expect(subject()).not.to.equal(subject());
		});

		describe('given a time', function() {
			it('accepts a Date', function() {
				const time = new Date;

				expect(subject(time).time).to.eql(time);
			});

			it('accepts milliseconds', function() {
				const time = Date.now();

				expect(subject(time).time.getTime()).to.eql(time);
			});

			it('preserves 0 milliseconds', function() {
				const time = 0;

				expect(subject(time).time.getTime()).to.eql(time);
			});

			it('defaults to now for null', function() {
				const now = Date.now();

				expect(subject(null).time.getTime())
					.to.be.within(now, now + 1);
			});

			it('defaults to now for undefined', function() {
				const now = Date.now();

				expect(subject(void(null)).time.getTime())
					.to.be.within(now, now + 1);
			});

			it('throws with other falsey values', function() {
				expect(() => subject(false)).to.throw()
				expect(() => subject('')).to.throw()
			});
		});
	});

	describe('.MIN', function() {
		const subject = () => described_namespace.MIN();

		it(`returns a ${generated_class.name}`, function() {
			expect(subject()).to.be.an.instanceof(generated_class);
		});

		it('always returns the same object', function() {
			expect(subject()).to.equal(subject());
		});

		it(`returns the smallest ${generated_class.name}`, function() {
			expect(subject().compare(subject())).to.equal(0);
			expect(subject().compare(described_namespace.generate())).to.equal(-1);
			expect(subject().compare(described_namespace.MAX())).to.equal(-1);
		});
	});

	describe('.MAX', function() {
		const subject = () => described_namespace.MAX();

		it(`returns a ${generated_class.name}`, function() {
			expect(subject()).to.be.an.instanceof(generated_class);
		});

		it('always returns the same object', function() {
			expect(subject()).to.equal(subject());
		});

		it(`returns the largest ${generated_class.name}`, function() {
			expect(subject().compare(subject())).to.equal(0);
			expect(subject().compare(described_namespace.generate())).to.equal(1);
			expect(subject().compare(described_namespace.MIN())).to.equal(1);
		});
	});
});
