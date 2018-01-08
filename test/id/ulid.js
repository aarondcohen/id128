'use strict';

const expect = require('chai').expect;

const ByteArray = require('common/byte-array');
const Ulid = require('id/ulid');

const described_class = Ulid;
describe(described_class.name, function() {
	describe('.generate', function() {
		const subject = (time) => described_class.generate(time);

		it('only accepts a Date', function() {
			[
				0,
				null,
				undefined,
				false,
				'2018-01-10',
				{ getTime: (() => {}) },
				[],
			].forEach((arg) => expect(() => subject(arg)).to.throw(TypeError));
		});

		it('rejects dates prior to 1970', function() {
			expect(() => subject(new Date(-1))).to.throw(RangeError);
		});

		it('rejects dates after 10889', function() {
			expect(() => subject(new Date(2 ** 48))).to.throw(RangeError);
		});

		it(`returns a new ${described_class.name}`, function() {
			expect(subject(new Date())).to.be.an.instanceOf(described_class);
		});

		it(`returns an id with different bytes each time`, function() {
			// NOTE: given the nature of random and the bit entropy,
			// we're guarding against extreme misfortune
			this.retries(2);

			expect(subject(new Date(0)).bytes)
				.not.to.deep.equal(subject(new Date(0)).bytes);
		});
	});

	describe('.MIN', function() {
		const subject = () => described_class.MIN();

		it('has all 1-bits', function() {
			expect(subject().bytes).to.deep.equal(ByteArray.generateZeroFilled());
		});

		it('has the least allowed time', function() {
			expect(subject().time).to.eql(new Date(0));
		});
	});

	describe('.MAX', function() {
		const subject = () => described_class.MAX();

		it('has all 1-bits', function() {
			expect(subject().bytes).to.deep.equal(ByteArray.generateOneFilled());
		});

		it('has the greatest allowed time', function() {
			expect(subject().time).to.eql(new Date(2 ** 48 - 1));
		});
	});

	describe('.bytes', function() {
		const subject = (bytes) => new described_class(bytes).bytes;

		it('returns the bytes given to the constructor', function() {
			[
				ByteArray.generateZeroFilled(),
				ByteArray.generateRandomFilled(),
				ByteArray.generateOneFilled(),
			].forEach((bytes) => expect(subject(bytes)).to.deep.equal(bytes));
		});
	});

	describe('.time', function() {
		const subject = (time) => described_class.generate(time).time;

		it('returns the time given to generate', function() {
			[
				0,
				Math.floor(2** 48 * Math.random()),
				Date.now(),
				2 ** 48 - 1,
			]
				.map(ms => new Date(ms))
				.forEach((time) => expect(subject(time)).to.eql(time));
		});
	});

	describe('.compare', function() {
		let id, other;
		const subject = () => id.compare(new described_class(other.bytes.slice()));

		const ids = [
			['min', described_class.MIN()],
			['min time', described_class.generate(described_class.MIN().time)],
			['current', described_class.generate(new Date())],
			['max time', described_class.generate(described_class.MAX().time)],
			['max', described_class.MAX()],
		];

		ids.forEach(([lhs_label, lhs_id], lhs_idx) => {
			describe(`given a ${lhs_label} id`, function() {
				beforeEach(() => (id = lhs_id));

				ids.forEach(([rhs_label, rhs_id], rhs_idx) => {
					const result = Math.sign(lhs_idx - rhs_idx);

					describe(`given a ${rhs_label} id`, function() {
						beforeEach(() => (other = rhs_id));

						it(`returns ${result}`, function() {
							expect(subject()).to.equal(result);
						});
					});
				});
			})
		});
	});

	describe('.equal', function() {
		let other;
		const id = new described_class(ByteArray.generateRandomFilled());
		const subject = () => id.equal(other);

		describe('given ids with the same bytes', function() {
			beforeEach(() => (other = new described_class(id.bytes.slice())));

			it('returns true', function() {
				expect(subject()).to.be.true;
			});
		});

		describe('given ids with different bytes', function() {
			beforeEach(() => (other = new described_class(id.bytes.map((byt) => ~byt))));

			it('returns false', function() {
				expect(id.equal(other)).to.be.false;
			});
		});
	});
});
