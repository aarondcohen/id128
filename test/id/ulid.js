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

const { Ulid: described_class } = require('id/ulid');;

describe(described_class.name, function() {
	assertDebuggable(described_class);

	assertGenerateBasics(described_class, [new Date(0)]);
	describe('.generate extended', function() {
		const subject = (time) => described_class.generate(time);

		it('accepts a Date', function() {
			const time = new Date;

			[
				['start of epoch time', described_class.MIN().time],
				['current time', new Date],
				['end of epoch time', described_class.MAX().time],
			].forEach(([label, value]) => {
				expect(() => subject(value), label).not.to.throw();
				expect(subject(value).time, label).to.eql(value);
			});
		});

		it('accepts milliseconds', function() {
			[
				['start of epoch time', described_class.MIN().time],
				['current time', new Date],
				['end of epoch time', described_class.MAX().time],
			].forEach(([label, value]) => {
				expect(() => subject(value.getTime()), label).not.to.throw();
				expect(subject(value.getTime()).time, label).to.eql(value);
			});
		});

		it('defaults to now for null and undefined', function() {
			[
				['null', null],
				['undefined', void(null)],
			].forEach(([label, value]) => {
				const now = new Date;

				expect(subject(value).time, label)
					.to.be.within(now, new Date(now.getTime() + 1));
			});
		});

		it('rejects pre-epoch values', function() {
			[
				['date prior to 1970', new Date(described_class.MIN().time.getTime() - 1)],
				['ms before epoch', described_class.MIN().time.getTime() - 1],
				['date after late 10889', new Date(described_class.MAX().time.getTime() + 1)],
				['ms after 48-bit epoch', described_class.MAX().time.getTime() + 1],
			].forEach(([label, value]) => {
				expect(() => subject(value), label).to.throw(RangeError);
			});
		});

		it('rejects other falsey values', function() {
			[
				['false', false],
				['empty string', ''],
			].forEach(([label, value]) => {
				expect(() => subject(value), label).to.throw(TypeError);
			});
		});

		it('rejects other Date-like values', function() {
			[
				['date string', '2018-01-10'],
				['duck type', { getTime: (() => {}) }],
			].forEach(([label, value]) => {
				expect(() => subject(value), label).to.throw(TypeError);
			});
		});
	});

	describe('.MIN', function() {
		const subject = () => described_class.MIN();

		it('has all 0-bits', function() {
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
			expect(subject().time).to.eql(new Date(Math.pow(2, 48) - 1));
		});
	});

	assertAccessorBytes(described_class);
	describe('#time', function() {
		const subject = (time) => described_class.generate(time).time;

		it('returns the time given to generate', function() {
			[
				0,
				Math.floor(Math.pow(2, 48) * Math.random()),
				Date.now(),
				Math.pow(2, 48) - 1,
			]
				.map(ms => new Date(ms))
				.forEach((time) => expect(subject(time)).to.eql(time));
		});
	});

	assertCompareDemonstratesTotalOrder([
		['the min id', described_class.MIN()],
		['a min time id', described_class.generate(described_class.MIN().time)],
		['a recent id', described_class.generate(new Date())],
		['a max time id', described_class.generate(described_class.MAX().time)],
		['the max id', described_class.MAX()],
	]);

	assertEqualDemonstratesSameness([
		['the min id', described_class.MIN()],
		['a min time id', described_class.generate(described_class.MIN().time)],
		['a recent id', described_class.generate(new Date())],
		['a max time id', described_class.generate(described_class.MAX().time)],
		['the max id', described_class.MAX()],
	]);
});
