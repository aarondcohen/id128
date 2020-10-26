'use strict';

const { expect } = require('chai');

const described_namespace = require('common/byte-array');

function assertByteArray(subject) {
	it('returns a Uint8Array', function() {
		expect(subject()).to.be.a('Uint8Array');
	});

	it('returns 16 bytes', function() {
		expect(subject()).to.have.lengthOf(16);
	});
}

describe(described_namespace.constructor.name, function() {
	describe('.compare', function() {
		const subject = described_namespace.compare;
		[
			['lhs < rhs', [1], [9], -1],
			['lhs = rhs', [5], [5], 0],
			['lhs > rhs', [9], [1], 1],
			['non-leading lhs < rhs', [5, 9], [5, 3], 1],
			['non-leading lhs = rhs', [5, 7], [5, 7], 0],
			['non-leading lhs > rhs', [5, 3], [5, 9], -1],
		].forEach(([label, lhs, rhs, result]) => {
			it(`resolves ${label} to ${result}`, function() {
				expect(subject(lhs, rhs)).to.equal(result);
			});
		});
	});

	describe('.generateOneFilled', function() {
		const subject = described_namespace.generateOneFilled;

		assertByteArray(subject);

		it('has only one bits', function() {
			expect(subject().every((val) => val === 0xFF)).to.be.true;
		});
	});

	describe('.generateRandomFilled', function() {
		const subject = described_namespace.generateRandomFilled;

		assertByteArray(subject);

		it('has mixed bits', function() {
			// NOTE: given the nature of random and the bit entropy,
			// we're guarding against extreme misfortune
      this.retries(1);

			const bytes = subject();
			expect(bytes.some((val) => val !== 0xFF)).to.be.true;
			expect(bytes.some((val) => val !== 0)).to.be.true;
		});

		it('almost always has different bits', function() {
			// NOTE: given the nature of random and the bit entropy,
			// we're guarding against extreme misfortune
      this.retries(1);

			expect(subject()).not.to.deep.equal(subject());
		});

		it('every call allocates distinct memory', function() {
			// NOTE: given the nature of random and the bit entropy,
			// we're guarding against extreme misfortune
      this.retries(1);

			const byte_arrays = Array.from({ length: 1000 })
				.map(subject)
				.map(x => x.toString());
			expect(new Set(byte_arrays)).to.have.lengthOf(1000);
		});
	});

	describe('.generateZeroFilled', function() {
		const subject = described_namespace.generateZeroFilled;

		assertByteArray(subject);

		it('has only zero bits', function() {
			expect(subject().every((val) => val === 0)).to.be.true;
		});
	});
});
