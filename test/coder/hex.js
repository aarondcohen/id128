'use strict';

const expect = require('chai').expect;

const { Coder } = require('../../');
const {
	InvalidDecodingError,
	InvalidEncodingError,
} = require('../../src/coder/error.js');

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
	HEX: '0123456789ABCDEF',
});

const described_namespace = Coder.HexCoder;

const bytes_any = makeBytes(16, () => randomInteger(256));
const bytes_max = makeBytes(16, () => (0xFF));
const bytes_min = makeBytes(16, () => (0));
const encoding_any = makeString(32, () => randomChar(ALPHABET.HEX));
const encoding_max = makeString(32, () => ('F'));
const encoding_min = makeString(32, () => ('0'));

const namespace_description = described_namespace.constructor.name
	+ ` using random encoding ${encoding_any}`;

describe(namespace_description, function() {
	describe('.decode', function() {
		const subject = described_namespace.decode.bind(described_namespace);

		it('requires a 32-character hex string', function() {
			[
				subject,
				subject.bind(null, makeBytes(32)),
				subject.bind(null, encoding_any.slice(0, -1)),
				subject.bind(null, encoding_any + randomChar(ALPHABET.HEX)),
				subject.bind(null, makeString(31, () => randomChar(ALPHABET.ASCII)) + '\0'),
			].forEach((expectation) => expect(subject)
				.to.throw(InvalidDecodingError, 'Requires a 32-character hex string'));

			expect(subject.bind(null, encoding_any)).not.to.throw();
		});

		it(`decodes ${encoding_min} to all 0-bits`, function() {
			expect(subject(encoding_min)).to.deep.equal(bytes_min);
		});

		it(`decodes ${encoding_max} to all 1-bits`, function() {
			expect(subject(encoding_max)).to.deep.equal(bytes_max);
		});

		it('ignores case', function() {
			const encoding = makeString(32, () => randomChar(
				ALPHABET.HEX + ALPHABET.HEX.toLowerCase()
			));

			expect(subject(encoding))
				.to.deep.equal(subject(encoding.toUpperCase()));
			expect(subject(encoding))
				.to.deep.equal(subject(encoding.toLowerCase()));
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
				subject.bind(null, makeBytes(15)),
				subject.bind(null, makeBytes(17)),
			].forEach((expectation) => expect(subject)
				.to.throw(InvalidEncodingError, 'Requires a 16-byte Uint8Array'));

			expect(subject.bind(null, bytes_any)).not.to.throw();
		});

		it(`encodes all 0-bits to ${encoding_min}`, function() {
			expect(subject(bytes_min)).to.equal(encoding_min);
		});

		it(`encodes all 1-bits to ${encoding_max}`, function() {
			expect(subject(bytes_max)).to.equal(encoding_max);
		});

		it('inverts decode', function() {
			expect(subject(described_namespace.decode(encoding_any)))
				.to.equal(encoding_any);
		});
	});
});
