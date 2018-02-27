'use strict';

const { expect } = require('chai');
const Os = require('os') || {};
const Sinon = require('sinon');
const ByteArray = require('common/byte-array');
const FakeMachine = require('common/fake-machine');

const described_singleton = require('common/machine');

describe(described_singleton.constructor.name, function() {
	beforeEach(() => described_singleton.reset());
	after(() => described_singleton.reset());

	describe('.mac_address', function() {
		const subject = () => described_singleton.mac_address;

		function assertFaked() {
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
		}

		let stubbed_os;
		before(() => (stubbed_os = Sinon.stub(Os, 'networkInterfaces')));
		beforeEach(() => stubbed_os.reset());
		after(() => stubbed_os.restore());

		it('detects a hardware mac address', function() {
			stubbed_os.callThrough();
			let is_supported = false;
			try {
				if (ByteArray.compare(subject(), FakeMachine.mac_address)) {
					is_supported = true;
				}
			}
			catch (_err) {}

			if (! is_supported) {
				this.skip();
			}
		});

		context('when the network interfaces are unavailable', function() {
			beforeEach(() => stubbed_os.returns([]));

			assertFaked();
		});

		context('when the network interfaces are available', function() {
			let interfaces;
			beforeEach(() => stubbed_os.returns(interfaces));

			context('when the interface is internal', function() {
				before(() => (interfaces = {
					lo: [{
							address: '127.0.0.1',
							netmask: '255.0.0.0',
							family: 'IPv4',
							mac: '00:00:00:00:00:00',
							internal: true,
							cidr: '127.0.0.1/8'
					}]
				}));

				assertFaked();
			});

			context('when the interface is missing a mac', function() {
				before(() => (interfaces = {
					wierd0: [{
						address: '192.168.1.108',
						netmask: '255.255.255.0',
						family: 'IPv4',
						mac: '',
						internal: false,
						cidr: '192.168.1.108/24'
					}]
				}));

				assertFaked();
			});

			context('when the interface is external and valid', function() {
				before(() => (interfaces = {
					eth0: [{
						address: '192.168.1.108',
						netmask: '255.255.255.0',
						family: 'IPv4',
						mac: '01:02:03:0a:0b:0c',
						internal: false,
						cidr: '192.168.1.108/24'
					}]
				}));

				it('returns a 6 byte address', function() {
					expect(subject()).to.be.a('Uint8Array');
					expect(subject()).to.have.length(6);
				});

				it('returns the same value every time', function() {
					expect(subject()).to.deep.equal(subject());
				});

				it('return the same value after a reset', function() {
					const original = subject();
					described_singleton.reset();
					expect(subject()).to.deep.equal(original);
				});
			});
		});
	});
});

