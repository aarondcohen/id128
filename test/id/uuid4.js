'use strict';

const { expect } = require('chai');
const {
	assertAccessorBytes,
	assertCompareDemonstratesTotalOrder,
	assertEqualDemonstratesSameness,
	assertGenerateBasics,
	assertUuidVariantVersion,
} = require('./shared');

const ByteArray = require('common/byte-array');

const { Uuid4: described_class } = require('id/uuid4');

describe(described_class.name, function() {
	assertGenerateBasics(described_class);

	describe('.MIN', function() {
		const subject = () => described_class.MIN();

		it('has all 0-bits other than variant/version', function() {
			const expected = ByteArray.generateZeroFilled();
			expected.set([0b01000000], 6);
			expected.set([0b10000000], 8);

			expect(subject().bytes).to.deep.equal(expected);
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
	});

	assertUuidVariantVersion(described_class, 1, 4);
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
