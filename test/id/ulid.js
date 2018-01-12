'use strict';

const expect = require('chai').expect;

const ByteArray = require('common/byte-array');
const {
	assertAccessorBytes,
	assertCompareDemonstratesTotalOrder,
	assertEqualDemonstratesSameness,
	assertGenerateBasics,
} = require('./shared');

const described_class = require('id/ulid');;

describe(described_class.name, function() {
	assertGenerateBasics(described_class, [new Date(0)]);

	describe('.generate extended', function() {
		const subject = (time) => described_class.generate(time);

		it('only accepts a Date', function() {
			[
				0,
				null,
				undefined,
				false,
				'2018-01-10',
				{ getTime: (() => {}) },
				[],
			].forEach((arg) => expect(() => subject(arg)).to.throw(TypeError));
		});

		it('rejects dates prior to 1970', function() {
			expect(() => subject(new Date(-1))).to.throw(RangeError);
		});

		it('rejects dates after 10889', function() {
			expect(() => subject(new Date(2 ** 48))).to.throw(RangeError);
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
			expect(subject().time).to.eql(new Date(2 ** 48 - 1));
		});
	});

	assertAccessorBytes(described_class);

	describe('#time', function() {
		const subject = (time) => described_class.generate(time).time;

		it('returns the time given to generate', function() {
			[
				0,
				Math.floor(2** 48 * Math.random()),
				Date.now(),
				2 ** 48 - 1,
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
