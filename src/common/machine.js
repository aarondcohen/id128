const Os = require('os');
const ByteArray = require('./byte-array');

const _mac_address = Symbol('mac-address');

class Machine {
	constructor() {
		this.reset();
	}

	get mac_address() {
		let mac_address = this[_mac_address];

		if (! mac_address) {
			const { mac } = Object.values(Os.networkInterfaces())
				.reduce((memo, arr) => memo.concat(arr), [])
				.find((iface) => ! iface.internal && iface.mac)
				|| {};

			mac_address = this[_mac_address] = mac
				? Uint8Array.from(mac.split(/:/), (hex) => Number.parseInt(hex, 16))
				: ByteArray.generateRandomFilled().slice(0, 6);

			if (! mac) {
				mac_address[0] |= 0b00000001;
			}
		}

		return mac_address;
	}

	reset() {
		this[_mac_address] = null;
	}
}

module.exports = new Machine;
