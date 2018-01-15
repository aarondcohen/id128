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

const described_namespace =  require('coder/uuid');

function makeUuid(alphabet) {
	return [8, 4, 4, 4, 12].map(len => makeString(len, alphabet)).join('-');
}

const encoding_any = makeUuid(ALPHABET.HEX);
const encoding_max = makeUuid('F');
const encoding_min = makeUuid('0');

describe(describeNamespace(described_namespace, encoding_any), function() {
	assertDecode({
		described_namespace,
		encoding_any,
		encoding_max,
		encoding_min,
	});

	describe('.decode extended', function() {
		const subject = described_namespace.decode.bind(described_namespace);

		it('requires a 32-character hex string (excluding hyphens)', function() {
			[
				subject,
				subject.bind(null, makeBytes(32)),
				subject.bind(null, encoding_any.slice(0, -1)),
				subject.bind(null, encoding_any + makeString(1, ALPHABET.HEX)),
				subject.bind(null, makeString(31, ALPHABET.ASCII) + '\0'),
			].forEach((expectation) => expect(subject)
				.to.throw(InvalidDecodingError, 'Requires a 32-character hex string with optional hyphens'));

			expect(subject.bind(null, encoding_any)).not.to.throw();
		});

		it('accepts without hyphens', function() {
			expect(subject(encoding_any.replace(/-/g, '')))
				.to.deep.equal(subject(encoding_any));
		});

		it('accepts hyphens in even groups of 4', function() {
			const encoding = encoding_any
				.replace(/-/g, '')
				.split(/(.{4})/)
				.filter(Boolean)
				.join('-');

			expect(subject(encoding))
				.to.deep.equal(subject(encoding_any));
		});

		it('ignores case', function() {
			const encoding = makeUuid(ALPHABET.HEX + ALPHABET.HEX.toLowerCase());

			expect(subject(encoding))
				.to.deep.equal(subject(encoding.toUpperCase()));
			expect(subject(encoding))
				.to.deep.equal(subject(encoding.toLowerCase()));
		});
	});

	assertEncode({
		described_namespace,
		encoding_any,
		encoding_max,
		encoding_min,
	});
});
