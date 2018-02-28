'use strict';

const { expect } = require('chai');
const {
	assertAccessorBytes,
	assertAccessorTime,
	assertCompareDemonstratesTotalOrder,
	assertDebuggable,
	assertEqualDemonstratesSameness,
	assertGenerateBasics,
} = require('./shared');

const ByteArray = require('common/byte-array');
const { InvalidEpoch } = require('common/exception');

const { Ulid: described_class } = require('id/ulid');;

const MAX_TIME = new Date(Math.pow(2, 48) - 1);
const MIN_TIME = new Date(0);

describe(described_class.name, function() {
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
	});

	describe('.MIN', function() {
		const subject = () => described_class.MIN();

		it('has all 0-bits', function() {
			expect(subject().bytes).to.deep.equal(ByteArray.generateZeroFilled());
		});

		it('has the least allowed time', function() {
			expect(subject().time).to.deep.equal(MIN_TIME);
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
	});

	assertAccessorBytes(described_class);
	assertAccessorTime(described_class, [
		['min', MIN_TIME],
		['now', new Date()],
		['max', MAX_TIME],
	]);

	assertCompareDemonstratesTotalOrder([
		['the min id', described_class.MIN()],
		['a min time id', described_class.generate({ time: MIN_TIME })],
		['a recent id', described_class.generate({ time: new Date })],
		['a max time id', described_class.generate({ time: MAX_TIME })],
		['the max id', described_class.MAX()],
	]);

	assertEqualDemonstratesSameness([
		['the min id', described_class.MIN()],
		['a min time id', described_class.generate({ time: MIN_TIME })],
		['a recent id', described_class.generate({ time: new Date })],
		['a max time id', described_class.generate({ time: MAX_TIME })],
		['the max id', described_class.MAX()],
	]);
});
