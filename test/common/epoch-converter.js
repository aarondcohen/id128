'use strict';

const { expect } = require('chai');
const { InvalidEpoch } = require('common/exception');

const described_namespace = require('common/epoch-converter');

describe(described_namespace.constructor.name, function() {
	const epoch_origin_ms = Date.parse('1955-11-05Z');
	const min_time = 0 + epoch_origin_ms;
	const max_time = Math.pow(2, 48) - 1 + epoch_origin_ms;
	const now = Date.now();

	describe('.fromEpoch', function() {
		const subject = (time) => described_namespace.fromEpoch(epoch_origin_ms, time);

		it('returns a Date', function() {
			expect(subject(0)).to.be.a('Date');
		});

		it('returns the time after adjusting for the origin', function() {
			[
				['min', 0, min_time],
				['origin', -epoch_origin_ms, 0],
				['now', now, now + epoch_origin_ms],
				['max', Math.pow(2, 48) - 1, max_time],
			].forEach(([label, epoch_ms, time]) => {
				expect(subject(epoch_ms).getTime(), label).to.equal(time);
			});
		});
	});

	describe('.toEpoch', function() {
		const subject = (time) => described_namespace.toEpoch(epoch_origin_ms, time);

		it('accepts a Date', function() {
			[
				['start of epoch time', new Date(min_time), 0],
				['origin of epoch time', new Date(0), -epoch_origin_ms],
				['current time', new Date(now + epoch_origin_ms), now],
				['end of epoch time', new Date(max_time), Math.pow(2, 48) - 1],
			].forEach(([label, value, epoch]) => {
				expect(() => subject(value), label).not.to.throw();
				expect(subject(value), label).to.equal(epoch);
			});
		});

		it('accepts milliseconds', function() {
			[
				['start of epoch time', min_time, 0],
				['origin of epoch time', 0, -epoch_origin_ms],
				['current time', now + epoch_origin_ms, now],
				['end of epoch time', max_time, Math.pow(2, 48) - 1],
			].forEach(([label, value, epoch]) => {
				expect(() => subject(value), label).not.to.throw();
				expect(subject(value), label).to.equal(epoch);
			});
		});

		it('defaults to now for null and undefined', function() {
			[
				['null', null],
				['undefined', void(null)],
			].forEach(([label, value]) => {
				const now = Date.now() - epoch_origin_ms;

				expect(subject(value), label).to.be.within(now, now + 1);
			});
		});

		it('rejects other falsey values', function() {
			[
				['false', false],
				['empty string', ''],
			].forEach(([label, value]) => {
				expect(() => subject(value), label).to.throw(InvalidEpoch);
			});
		});

		it('rejects other Date-like values', function() {
			[
				['date string', '2018-01-10'],
				['duck type', { getTime: (() => {}) }],
			].forEach(([label, value]) => {
				expect(() => subject(value), label).to.throw(InvalidEpoch);
			});
		});

		it('rejects pre/post-epoch values', function() {
			[
				['date before epoch time', new Date(min_time - 1)],
				['ms before epoch time', min_time - 1],
				['date after epoch time', new Date(max_time + 1)],
				['ms after epoch time', max_time + 1],
			].forEach(([label, value]) => {
				expect(() => subject(value), label).to.throw(InvalidEpoch);
			});
		});
	});
});
