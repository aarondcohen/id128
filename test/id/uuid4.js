'use strict';

const expect = require('chai').expect;

const ByteArray = require('common/byte-array');
const {
	assertAccessorBytes,
	assertCompareDemonstratesTotalOrder,
	assertEqualDemonstratesSameness,
	assertGenerateBasics,
} = require('./shared');

const described_class = require('id/uuid4');

describe(described_class.name, function() {
	assertGenerateBasics(described_class);

	describe('.generate extended', function() {
		const subject = () => described_class.generate();

		it('is variant 1', function() {
			expect(subject().variant).to.eql(1);
		});

		it('is version 4', function() {
			expect(subject().version).to.eql(4);
		});
	});

	describe('.MIN', function() {
		const subject = () => described_class.MIN();

		it('has all 0-bits other than variant/version', function() {
			const expected = ByteArray.generateZeroFilled();
			expected.set([0b01000000], 6);
			expected.set([0b10000000], 8);

			expect(subject().bytes).to.deep.equal(expected);
		});

		it('is variant 1', function() {
			expect(subject().variant).to.eql(1);
		});

		it('is version 4', function() {
			expect(subject().version).to.eql(4);
		});
	});

	describe('.MAX', function() {
		const subject = () => described_class.MAX();

		it('has all 1-bits other than variant/version', function() {
			const expected = ByteArray.generateOneFilled();
			expected.set([0b01001111], 6);
			expected.set([0b10111111], 8);

			expect(subject().bytes).to.deep.equal(expected);
		});

		it('is variant 1', function() {
			expect(subject().variant).to.eql(1);
		});

		it('is version 4', function() {
			expect(subject().version).to.eql(4);
		});
	});

	assertAccessorBytes(described_class);

	assertCompareDemonstratesTotalOrder([
		['the min id', described_class.MIN()],
		['a random id', described_class.generate()],
		['the max id', described_class.MAX()],
	]);

	assertEqualDemonstratesSameness([
		['the min id', described_class.MIN()],
		['a random id', described_class.generate()],
		['the max id', described_class.MAX()],
	]);
});
