'use strict';

const { expect } = require('chai');

const ByteArray = require('common/byte-array');
const {
	InvalidDecodingError,
	InvalidEncodingError,
} = require('common/error');

// Constants

const BYTES = Object.freeze({
	ANY: ByteArray.generateRandomFilled(),
	MAX: ByteArray.generateOneFilled(),
	MIN: ByteArray.generateZeroFilled(),
});

const ALPHABET = Object.freeze({
	ASCII: Array.from({ length: 128 }, (v, k) => String.fromCharCode(k)).join(''),
	CROCKFORD32: '0123456789ABCDEFGHJKMNPQRSTVWXYZ',
	HEX: '0123456789ABCDEF',
});

//Helpers

function describeNamespace(described_namespace, encoding_any) {
	return described_namespace.constructor.name
		+ ` (with random encoding ${encoding_any})`;
}

function makeBytes(length) {
	return Uint8Array.from({length});
}

function makeString(length, alphabet) {
	const generator = () => randomChar(alphabet);
	return Array.from({length}, generator).join('');
}

function randomChar(alphabet) {
	const random_idx = Math.floor(alphabet.length * Math.random());
	return alphabet.charAt(random_idx);
}

//Assertions

function assertDecode({
	described_namespace,
	encoding_any,
	encoding_max,
	encoding_min,
} = {}) {
	describe('.decode', function() {
		const subject = described_namespace.decode.bind(described_namespace);

		it(`decodes ${encoding_min} to all 0-bits`, function() {
			expect(subject(encoding_min)).to.deep.equal(BYTES.MIN);
		});

		it(`decodes ${encoding_max} to all 1-bits`, function() {
			expect(subject(encoding_max)).to.deep.equal(BYTES.MAX);
		});

		it('inverts encode', function() {
			expect(subject(described_namespace.encode(BYTES.ANY)))
				.to.deep.equal(BYTES.ANY);
		});
	});
}

function assertEncode({
	described_namespace,
	encoding_any,
	encoding_max,
	encoding_min,
} = {}) {
	describe('.encode', function() {
		const subject = described_namespace.encode.bind(described_namespace);

		it('requires a 16-byte Uint8Array', function() {
			[
				subject,
				subject.bind(null, makeString(16, '\0')),
				subject.bind(null, makeBytes(15)),
				subject.bind(null, makeBytes(17)),
			].forEach((expectation) => expect(subject)
				.to.throw(InvalidEncodingError, 'Requires a 16-byte Uint8Array'));

			expect(subject.bind(null, BYTES.ANY)).not.to.throw();
		});

		it(`encodes all 0-bits to ${encoding_min}`, function() {
			expect(subject(BYTES.MIN)).to.equal(encoding_min);
		});

		it(`encodes all 1-bits to ${encoding_max}`, function() {
			expect(subject(BYTES.MAX)).to.equal(encoding_max);
		});

		it('inverts decode', function() {
			expect(subject(described_namespace.decode(encoding_any)))
				.to.equal(encoding_any);
		});
	});
}

module.exports = {
	ALPHABET,
	assertDecode,
	assertEncode,
	describeNamespace,
	makeBytes,
	makeString,
};
