'use strict';

const { expect } = require('chai');

const described_singleton = require('common/fake-machine');

describe(described_singleton.constructor.name, function() {
	beforeEach(() => described_singleton.reset());
	after(() => described_singleton.reset());

	describe('.mac_address', function() {
		const subject = () => described_singleton.mac_address;

		it('returns a 6 byte address', function() {
			expect(subject()).to.be.a('Uint8Array');
			expect(subject()).to.have.length(6);
		});

		it('sets the multicast bit', function() {
			expect(subject()[0]).to.satisfy((num) => (num & 0b00000001))
		});

		it('returns the same value every time', function() {
			expect(subject()).to.deep.equal(subject());
		});

		it('returns a new value after a reset', function() {
			const original = subject();
			described_singleton.reset();
			expect(subject()).not.to.deep.equal(original);
		});
	});
});
