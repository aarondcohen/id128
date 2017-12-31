'use strict';

const expect = require('chai').expect;

const { Coder } = require('../../');

function makeBytes(length = 16, fn = () => {}) {
	return Uint8Array.from({length}, fn);
}

function makeString(length = 32, fn = () => { return '\0' }) {
	return Array.from({length}, fn).join('');
}

function randomChar(alphabet) {
	return alphabet.charAt(randomInteger(alphabet.length));
}

function randomInteger(max) {
	return Math.floor(max * Math.random());
}

const ALPHABET = Object.freeze({
	ASCII: makeString(128, (v, k) => String.fromCharCode(k)),
	HEX: '0123456789ABCDEFabcdef',
});

const described_namespace = Coder.HexCoder;

describe(described_namespace.constructor.name, function() {
	const bytes_any = makeBytes(16, () => randomInteger(256));
	const bytes_max = makeBytes(16, () => (0xFF));
	const bytes_min = makeBytes(16, () => (0));
	const hex_any = makeString(32, () => randomChar(ALPHABET.HEX));
	const hex_max = makeString(32, () => ('F'));
	const hex_min = makeString(32, () => ('0'));

	describe('.decode', function() {
		const subject = described_namespace.decode.bind(described_namespace);

		it('requires a 32-character hex string', function() {
			[
				subject,
				subject.bind(null, makeBytes(32)),
				subject.bind(null, makeString(31, () => ('0'))),
				subject.bind(null, makeString(33, () => ('0'))),
				subject.bind(null, makeString(31, () => randomChar(ALPHABET.ASCII)) + '!'),
			].forEach((expectation) => expect(subject)
				.to.throw(Error, 'Requires a 32-character hex string'));

			expect(subject.bind(null, hex_any)).not.to.throw();
		});

		it(`decodes ${hex_min} to all 0-bits`, function() {
			expect(subject(hex_min)).to.deep.equal(bytes_min);
		});

		it(`decodes ${hex_max} to all 1-bits`, function() {
			expect(subject(hex_max)).to.deep.equal(bytes_max);
		});

		it('is case insenstive', function() {
			expect(subject(hex_any))
				.to.deep.equal(subject(hex_any.toUpperCase()));
			expect(subject(hex_any))
				.to.deep.equal(subject(hex_any.toLowerCase()));
		});

		it('inverts encode', function() {
			expect(subject(described_namespace.encode(bytes_any)))
				.to.deep.equal(bytes_any);
		});
	});

	describe('.encode', function() {
		const subject = described_namespace.encode.bind(described_namespace);

		it('requires a 16-byte Uint8Array', function() {
			[
				subject,
				subject.bind(null, makeString(16)),
				subject.bind(null, makeBytes(15, () => (0))),
				subject.bind(null, makeBytes(17, () => (0))),
			].forEach((expectation) => expect(subject)
				.to.throw(Error, 'Requires a 16-byte Uint8Array'));

			expect(subject.bind(null, bytes_any)).not.to.throw();
		});

		it(`encodes all 0-bits to ${hex_min}`, function() {
			expect(subject(bytes_min)).to.equal(hex_min);
		});

		it(`encodes all 1-bits to ${hex_max}`, function() {
			expect(subject(bytes_max)).to.equal(hex_max);
		});

		it('inverts decode (modulo case-sensitivity)', function() {
			expect(subject(described_namespace.decode(hex_any)))
				.to.deep.equal(hex_any.toUpperCase());
		});
	});
});
