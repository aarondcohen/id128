'use strict';

const { expect } = require('chai');
const {
	assertAccessorBytes,
	assertAccessorNode,
	assertAccessorTime,
	assertCompareDemonstratesTotalOrder,
	assertDebuggable,
	assertEqualDemonstratesSameness,
	assertGenerateBasics,
	assertUuidVariantVersion,
} = require('./shared');

const ByteArray = require('common/byte-array');
const { InvalidEpoch } = require('common/exception');

const { Uuid6: described_class } = require('id/uuid-6');

const ORIGIN = Date.parse('1582-10-15Z');
const MAX_TIME = new Date(Math.pow(2, 48) - 1 + ORIGIN);
const MIN_TIME = new Date(ORIGIN);

describe(described_class.name, function() {
	beforeEach(() => described_class.reset());
	after(() => described_class.reset());

	assertDebuggable(described_class);
	assertGenerateBasics(described_class);
	describe('.generate extended', function() {
		const CLOCK_MAX = 0x3FFF;
		const HIRES_MAX = 0x0FFF;
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
				['prior to Gregorian calendar', MIN_TIME - 1],
				['after late 10502', MAX_TIME + 1],
			].forEach(([label, value]) => {
				expect(() => subject(value), label).to.throw(InvalidEpoch);
			});
		});

		context('when given a time in the past', function() {
			it('increments the hires timer', function() {
				const previous_id = subject();
				expect(subject(MIN_TIME).hires_time)
					.to.equal(previous_id.hires_time + 1);
			});

			it('increments the clock sequence', function() {
				// For the minor chance that the clock sequence starts at the top
				this.retries(1);

				const previous_id = subject();
				expect(subject(MIN_TIME).clock_sequence)
					.to.equal(previous_id.clock_sequence + 1);
			});

			context('when the clock sequence overflows', function() {
				function clockOverflow(time) {
					for (let count = 0; count < CLOCK_MAX; ++count) {
						subject(time);
					}
				}

				it('resets the clock sequence', function() {
					subject();
					clockOverflow(MIN_TIME);
					expect(subject(MIN_TIME).hires_time).to.equal(0);
				});
			});
		});

		context('when given the same time', function() {
			const time = Date.now();

			it('increments the hires timer', function() {
				const previous_id = subject(time);
				expect(subject(time).hires_time).to.equal(previous_id.hires_time + 1);
			});

			context('when the hires timer overflows', function() {
				function hiresOverflow(time) {
					for (let count = 0; count < HIRES_MAX; ++count) {
						subject(time);
					}
				}

				it('resets the hires timer', function() {
					subject();
					hiresOverflow(time);
					expect(subject(time).hires_time).to.equal(0);
				});

				it('increments the clock sequence', function() {
					// For the minor chance that the clock sequence starts at the top
					this.retries(1);

					const previous_id = subject(time);
					hiresOverflow(time);
					expect(subject(time).clock_sequence)
						.to.equal(previous_id.clock_sequence + 1);
				});
			});
		});

		context('when given a time in the future', function() {
			it('resets the hires timer', function() {
				subject();
				expect(subject(MAX_TIME).hires_time).to.equal(0);
			});

			it('retains the same clock sequence', function() {
				const previous_id = subject();
				expect(subject(MAX_TIME).clock_sequence)
					.to.equal(previous_id.clock_sequence);
			});
		});
	});

	describe('.MIN', function() {
		const subject = () => described_class.MIN();

		it('has all 0-bits other than variant/version', function() {
			const expected = ByteArray.generateZeroFilled();
			expected.set([0b01100000], 6);
			expected.set([0b10000000], 8);

			expect(subject().bytes).to.deep.equal(expected);
		});
	});

	describe('.MAX', function() {
		const subject = () => described_class.MAX();

		it('has all 1-bits other than variant/version', function() {
			const expected = ByteArray.generateOneFilled();
			expected.set([0b01101111], 6);
			expected.set([0b10111111], 8);

			expect(subject().bytes).to.deep.equal(expected);
		});
	});

	assertUuidVariantVersion(described_class, 1, 6);
	assertAccessorBytes(described_class);
	assertAccessorNode(described_class);
	assertAccessorTime(described_class, [
		['min', MIN_TIME],
		['origin', new Date(0)],
		['now', new Date()],
		['max', MAX_TIME],
	]);

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

