'use strict';

const { expect } = require('chai');

const described_namespace = require('common/uint-converter');

describe(described_namespace.constructor.name, function() {
	describe('.assignUint', function() {
		it('assigns to exactly the given indices', function() {
			[
				[0x00000000, [0x65, 0x00, 0x00, 0x00, 0x65]],
				[0x0000FEED, [0x65, 0x00, 0xFE, 0xED, 0x65]],
				[0x00BEFEAD, [0x65, 0xBE, 0xFE, 0xAD, 0x65]],
				[0xDEADBEEF, [0x65, 0xAD, 0xBE, 0xEF, 0x65]],
			].forEach(([uint, result]) => {
				const bytes = new Array(5).fill(0x65);
				described_namespace.assignUint(1, 4, bytes, uint);
				expect(bytes).to.deep.equal(result);
			})
		});
	});

	describe('.extractUint', function() {
		it('extracts exactly the given indices', function() {
			[
				0,
				0xFEED,
				0xBEFEAD,
			].forEach((uint) => {
				const bytes = new Array(5).fill(0x65);
				described_namespace.assignUint(1, 4, bytes, uint);
				expect(described_namespace.extractUint(1, 4, bytes)).to.equal(uint);
			});
		});
	});
});
