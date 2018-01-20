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
const { InvalidSeed } = require('common/exception');

const { Ulid: described_class } = require('id/ulid');;

const MAX_TIME = new Date(Math.pow(2, 48) - 1);
const MIN_TIME = new Date(0);

describe(described_class.name, function() {
	assertDebuggable(described_class);

	assertGenerateBasics(described_class, [new Date(0)]);
	describe('.generate extended', function() {
		const subject = (time) => described_class.generate(time);

		it('accepts a Date', function() {
			[
				['start of epoch time', MIN_TIME],
				['current time', new Date],
				['end of epoch time', MAX_TIME],
			].forEach(([label, value]) => {
				expect(() => subject(value), label).not.to.throw();
				expect(subject(value).time, label).to.eql(value);
			});
		});

		it('accepts milliseconds', function() {
			[
				['start of epoch time', MIN_TIME],
				['current time', new Date],
				['end of epoch time', MAX_TIME],
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

		it('rejects pre/post-epoch values', function() {
			[
				['date prior to 1970', new Date(MIN_TIME.getTime() - 1)],
				['ms before epoch', MIN_TIME.getTime() - 1],
				['date after late 10889', new Date(MAX_TIME.getTime() + 1)],
				['ms after 48-bit epoch', MAX_TIME.getTime() + 1],
			].forEach(([label, value]) => {
				expect(() => subject(value), label).to.throw(InvalidSeed);
			});
		});

		it('rejects other falsey values', function() {
			[
				['false', false],
				['empty string', ''],
			].forEach(([label, value]) => {
				expect(() => subject(value), label).to.throw(InvalidSeed);
			});
		});

		it('rejects other Date-like values', function() {
			[
				['date string', '2018-01-10'],
				['duck type', { getTime: (() => {}) }],
			].forEach(([label, value]) => {
				expect(() => subject(value), label).to.throw(InvalidSeed);
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
				MIN_TIME,
				new Date(Math.floor(MAX_TIME.getTime() * Math.random())),
				new Date(),
				MAX_TIME,
			].forEach((time) => expect(subject(time)).to.eql(time));
		});
	});

	assertCompareDemonstratesTotalOrder([
		['the min id', described_class.MIN()],
		['a min time id', described_class.generate(MIN_TIME)],
		['a recent id', described_class.generate(new Date())],
		['a max time id', described_class.generate(MAX_TIME)],
		['the max id', described_class.MAX()],
	]);

	assertEqualDemonstratesSameness([
		['the min id', described_class.MIN()],
		['a min time id', described_class.generate(MIN_TIME)],
		['a recent id', described_class.generate(new Date())],
		['a max time id', described_class.generate(MAX_TIME)],
		['the max id', described_class.MAX()],
	]);
});
