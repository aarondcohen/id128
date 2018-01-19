'use strict';

const { expect } = require('chai');
const {
	ALPHABET,
	assertDecode,
	assertEncode,
	describeNamespace,
	makeBytes,
	makeString,
} = require('./shared');

const { InvalidDecodingError } = require('common/error');

const described_namespace = require('coder/hex');

const encoding_any = makeString(32, ALPHABET.HEX);
const encoding_max = makeString(32, 'F');
const encoding_min = makeString(32, '0');

describe(describeNamespace(described_namespace, encoding_any), function() {
	assertDecode({
		described_namespace,
		encoding_any,
		encoding_max,
		encoding_min,
	});

	describe('.decode', function() {
		const subject = described_namespace.decode.bind(described_namespace);

		it('requires a 32-character hex string', function() {
			[
				subject,
				subject.bind(null, makeBytes(32)),
				subject.bind(null, encoding_any.slice(0, -1)),
				subject.bind(null, encoding_any + makeString(1, ALPHABET.HEX)),
				subject.bind(null, makeString(31, ALPHABET.ASCII) + '\0'),
			].forEach(expectation => expect(subject).to.throw(InvalidDecodingError));

			expect(subject.bind(null, encoding_any)).not.to.throw();
		});
	});

	describe('.decodeTrusted extended', function() {
		const subject = described_namespace.decodeTrusted.bind(described_namespace);

		it('ignores case', function() {
			const encoding = makeString(32, ALPHABET.HEX + ALPHABET.HEX.toLowerCase());

			expect(subject(encoding)).to.deep.equal(subject(encoding.toUpperCase()));
			expect(subject(encoding)).to.deep.equal(subject(encoding.toLowerCase()));
		});
	});

	assertEncode({
		described_namespace,
		encoding_any,
		encoding_max,
		encoding_min,
	});
});
