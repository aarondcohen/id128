'use strict';

const { expect } = require('chai');
const {
	assertAccessorBytes,
	assertCompareDemonstratesTotalOrder,
	assertDebuggable,
	assertEqualDemonstratesSameness,
	assertGenerateBasics,
} = require('./shared');

const ByteArray = require('common/byte-array');
const {
	ClockSequenceOverflow,
	InvalidEpoch,
} = require('common/exception');

const { UlidMonotonic: described_class } = require('id/ulid-monotonic');

const MAX_TIME = new Date(Math.pow(2, 48) - 1);
const MIN_TIME = new Date(0);

describe(described_class.name, function() {
	beforeEach(() => described_class.resetClockSequence());
	after(() => described_class.resetClockSequence());

	assertDebuggable(described_class);

	assertGenerateBasics(described_class);
	describe('.generate extended', function() {
		const subject = (time) => described_class.generate({ time });

		it('accepts epoch values', function() {
			[
				['start of epoch', MIN_TIME],
				['end of epoch', MAX_TIME],
			].forEach(([label, value]) => {
				expect(() => subject(value), label).not.to.throw(InvalidEpoch);
			});
		});

		it('rejects pre/post-epoch values', function() {
			[
				['prior to 1970', MIN_TIME - 1],
				['after late 10889', MAX_TIME + 1],
			].forEach(([label, value]) => {
				expect(() => subject(value), label).to.throw(InvalidEpoch);
			});
		});

		it('throws when the clock sequence overflows', function() {
			const overflow = 0x10001;
			let sequence = 0;

			subject(Date.now() + 24 * 60 * 60 * 1000);
			expect(() => {
				for (; sequence <= overflow; ++sequence) {
					subject();
				}
			}).to.throw(ClockSequenceOverflow);
			expect(sequence).to.be.above(overflow >> 1);
			expect(sequence).to.be.below(overflow);
		});
	});

	describe('.MIN', function() {
		const subject = () => described_class.MIN();

		it('has all 0-bits', function() {
			expect(subject().bytes).to.deep.equal(ByteArray.generateZeroFilled());
		});

		it('has the least allowed time', function() {
			expect(subject().time).to.deep.equal(MIN_TIME);
		});

		it('ignores monotonicity', function() {
			subject();
			expect(subject().bytes).to.deep.equal(ByteArray.generateZeroFilled());
		});
	});

	describe('.MAX', function() {
		const subject = () => described_class.MAX();

		it('has all 1-bits', function() {
			expect(subject().bytes).to.deep.equal(ByteArray.generateOneFilled());
		});

		it('has the greatest allowed time', function() {
			expect(subject().time).to.deep.equal(MAX_TIME);
		});

		it('ignores monotonicity', function() {
			subject();
			expect(subject().bytes).to.deep.equal(ByteArray.generateOneFilled());
		});
	});

	assertAccessorBytes(described_class);
	describe('#time', function() {
		const subject = (time) => described_class.generate({ time }).time;

		describe('given a future time', function() {
			it('returns the time given to generate', function() {
				[
					['min', MIN_TIME],
					['now', new Date()],
					['max', MAX_TIME],
				].forEach(([label, time]) => {
					expect(subject(time), label).to.deep.equal(time);
				});
			});
		});

		describe('given a past time', function() {
			let most_recent_time;
			beforeEach(() => (most_recent_time = subject(MAX_TIME)));

			it('returns the same time as the most recent id', function() {
				[
					['min', MIN_TIME],
					['now', new Date()],
					['max', MAX_TIME],
				].forEach(([label, time]) => {
					expect(subject(time), label).to.deep.equal(most_recent_time);
				});
			});
		});
	});

	assertCompareDemonstratesTotalOrder([
		['the min id', described_class.MIN()],
		['a min time id', described_class.generate({ time: MIN_TIME })],
		['a recent id', described_class.generate({ time: new Date })],
		['a max time id', described_class.generate({ time: MAX_TIME })],
		['an anachronistic id', described_class.generate({ time: new Date })],
		['the max id', described_class.MAX()],
	]);

	assertEqualDemonstratesSameness([
		['the min id', described_class.MIN()],
		['a min time id', described_class.generate({ time: MIN_TIME })],
		['a recent id', described_class.generate({ time: new Date() })],
		['a max time id', described_class.generate({ time: MAX_TIME })],
		['an anachronistic id', described_class.generate({ time: new Date() })],
		['the max id', described_class.MAX()],
	]);
});
