'use strict';

const { expect } = require('chai');

const ByteArray = require('common/byte-array');

const extractId = ([_, id]) => id;
const extractLabel = ([label, _]) => label;

function assertAccessorBytes(described_class) {
	describe('#bytes', function() {
		const subject = (bytes) => new described_class(bytes).bytes;

		it('returns the bytes given to the constructor', function() {
			[
				ByteArray.generateZeroFilled(),
				ByteArray.generateRandomFilled(),
				ByteArray.generateOneFilled(),
			].forEach((bytes) => expect(subject(bytes)).to.deep.equal(bytes));
		});
	});
}

function assertAccessorTime(described_class, labeled_times) {
	describe('#time', function() {
		const subject = (time) => described_class.generate({ time }).time;

		it('returns the time given to generate', function() {
			labeled_times.forEach(([label, time]) => {
				expect(subject(time), label).to.deep.equal(time)
			});
		});
	});
}

function assertCompareDemonstratesTotalOrder(labeled_ids) {
	describe('#compare', function() {
		const diagnose = (lhs, rhs) => `(${lhs}).compare(${rhs})`;

		labeled_ids.forEach(([lhs_label, lhs_id], lhs_idx) => {
			const subject = (other) => lhs_id.compare(other.clone());
			const prev_ids = labeled_ids.filter((_, idx) => (idx < lhs_idx));
			const next_ids = labeled_ids.filter((_, idx) => (idx > lhs_idx));

			describe(`given ${lhs_label}`, function() {
				if (lhs_idx === labeled_ids.length - 1) {
					it('has no subsequent ids', function() {
						expect(next_ids, `${lhs_label} should be the last id`).to.be.empty;
					});
				} else {
					it('returns -1 for all subsequent ids', function() {
						next_ids.forEach(([label, id]) => {
							expect(subject(id), diagnose(lhs_label, label)).to.equal(-1);
						});
					});
				}

				it('returns 0 for itself', function() {
					const [label, id] = labeled_ids[lhs_idx];
					expect(subject(id), label).to.equal(0);
				});

				if (lhs_idx === 0) {
					it('has no previous ids', function() {
						expect(prev_ids, `${lhs_label} should be the first id`).to.be.empty;
					});
				} else {
					it('returns 1 for all previous ids', function() {
						prev_ids.forEach(([label, id]) => {
							expect(subject(id), diagnose(lhs_label, label)).to.equal(1);
						});
					});
				}
			});
		});
	});
}

function assertDebuggable(described_class) {
	describe('when cast as a string', function() {
		const subject = () => '' + new described_class();

		it(`mentions the type ${described_class.name}`, function() {
			expect(subject()).to.contain.string(described_class.name);
		});
	});
}

function assertEqualDemonstratesSameness(labeled_ids) {
	describe('#equal', function() {
		const diagnose = (lhs, rhs) => `(${lhs}).equal(${rhs})`;

		labeled_ids.forEach(([lhs_label, lhs_id]) => {
			const subject = (other) => lhs_id.equal(other.clone());

			describe(`given ${lhs_label}`, function() {
				it('returns true for itself', function() {
					expect(subject(lhs_id)).to.be.true;
				});

				it('returns false for all others', function() {
					labeled_ids
						.filter((pair) => extractId(pair) !== lhs_id)
						.forEach(([label, id]) => {
							expect(subject(id), diagnose(lhs_label, label)).to.be.false
						});
				});
			});
		});
	});
}

function assertGenerateBasics(described_class) {
	describe('.generate', function() {
		const subject = () => described_class.generate();

		it(`returns a new ${described_class.name}`, function() {
			expect(subject()).to.be.an.instanceOf(described_class);
		});

		it(`returns an id with different bytes each time`, function() {
			// NOTE: given the nature of random and the bit entropy,
			// we're guarding against extreme misfortune
			this.retries(2);

			expect(subject().bytes).not.to.deep.equal(subject().bytes);
		});
	});
}

function assertUuidVariantVersion(described_class, variant, version) {
	const assertVariant = (subject) => it(`is variant ${variant}`, function() {
		expect(subject().variant).to.eql(variant);
	});
	const assertVersion = (subject) => it(`is version ${version}`, function() {
		expect(subject().version).to.eql(version);
	});

	describe('.generate variant/version', function() {
		const subject = () => described_class.generate();

		assertVariant(subject);
		assertVersion(subject);
	});

	describe('.MIN variant/version', function() {
		const subject = () => described_class.MIN();

		assertVariant(subject);
		assertVersion(subject);
	});

	describe('.MAX variant/version', function() {
		const subject = () => described_class.MAX();

		assertVariant(subject);
		assertVersion(subject);
	});
}

module.exports = {
	assertAccessorBytes,
	assertAccessorTime,
	assertCompareDemonstratesTotalOrder,
	assertDebuggable,
	assertEqualDemonstratesSameness,
	assertGenerateBasics,
	assertUuidVariantVersion,
};
