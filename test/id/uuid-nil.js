'use strict';

const { expect } = require('chai');
const {
	assertAccessorBytes,
	assertUuidVariantVersion,
} = require('./shared');

const ByteArray = require('common/byte-array');

const { UuidNil: described_class } = require('id/uuid-nil');

describe(described_class.name, function() {
	describe('.generate', function() {
		const subject = () => described_class.generate();

		it(`returns a new ${described_class.name}`, function() {
			expect(subject()).to.be.an.instanceOf(described_class);
		});
	});

	describe('.MIN', function() {
		const subject = () => described_class.MIN();

		it('has all 0-bits', function() {
			const expected = ByteArray.generateZeroFilled();

			expect(subject().bytes).to.deep.equal(expected);
		});
	});

	describe('.MAX', function() {
		const subject = () => described_class.MAX();

		it('has all 0-bits', function() {
			const expected = ByteArray.generateZeroFilled();

			expect(subject().bytes).to.deep.equal(expected);
		});
	});

	assertUuidVariantVersion(described_class, 0, 0);
	assertAccessorBytes(described_class);

	describe('#compare', function() {
		const diagnose = (lhs, rhs) => `(${lhs}).compare(${rhs})`;

		const labeled_ids = [
			['the min id', described_class.MIN()],
			['a random id', described_class.generate()],
			['another random id', described_class.generate()],
			['the max id', described_class.MAX()],
		];

		labeled_ids.forEach(([lhs_label, lhs_id], lhs_idx) => {
			const subject = (other) => lhs_id.compare(other.clone());

			describe(`given ${lhs_label}`, function() {
				it('returns 0 for all ids', function() {
					labeled_ids.forEach(([label, id]) => {
						expect(subject(id), diagnose(lhs_label, label)).to.equal(0);
					});
				});
			});
		});
	});

	describe('#equal', function() {
		const diagnose = (lhs, rhs) => `(${lhs}).equal(${rhs})`;

		const labeled_ids = [
			['the min id', described_class.MIN()],
			['a random id', described_class.generate()],
			['another random id', described_class.generate()],
			['the max id', described_class.MAX()],
		];

		labeled_ids.forEach(([lhs_label, lhs_id]) => {
			const subject = (other) => lhs_id.equal(other.clone());

			describe(`given ${lhs_label}`, function() {
				it('returns true for all ids', function() {
					labeled_ids.forEach(([label, id]) => {
						expect(subject(id), diagnose(lhs_label, label)).to.be.true;
					});
				});
			});
		});
	});
});

