'use strict';

const expect = require('chai').expect;
const {
	ALPHABET,
	assertDecode,
	assertEncode,
	describeNamespace,
	makeBytes,
	makeString,
} = require('./shared');

const { InvalidDecodingError } = require('coder/error');

const described_namespace =  require('coder/crockford32');

const encoding_any = ''
	+ makeString(1, '01234567')
	+ makeString(25, ALPHABET.CROCKFORD32);
const encoding_max = '7' + makeString(25, 'Z');
const encoding_min = makeString(26, '0');

describe(describeNamespace(described_namespace, encoding_any), function() {
	assertDecode({
		described_namespace,
		encoding_any,
		encoding_max,
		encoding_min,
	});

	describe('.decode extended', function() {
		const subject = described_namespace.decode.bind(described_namespace);

		it('requires a 26-character Crockford32 string', function() {
			[
				subject,
				subject.bind(null, makeBytes(26)),
				subject.bind(null, encoding_any.slice(0, -1)),
				subject.bind(null, encoding_any + makeString(1, ALPHABET.CROCKFORD32)),
				subject.bind(null, makeString(25, ALPHABET.ASCII) + '!'),
			].forEach((expectation) => expect(subject)
				.to.throw(InvalidDecodingError, 'Requires a 26-character Crockford32 string'));

			expect(subject.bind(null, encoding_any)).not.to.throw();
		});

		it('ignores case', function() {
			const encoding = makeString(1, '01234567')
				+ makeString(25, ALPHABET.CROCKFORD32 + ALPHABET.CROCKFORD32.toLowerCase());

			expect(subject(encoding))
				.to.deep.equal(subject(encoding.toUpperCase()));
			expect(subject(encoding))
				.to.deep.equal(subject(encoding.toLowerCase()));
		});

		it('converts visually similar characters', function() {
			const encoding = encoding_any.slice(0, -1);
			const conversions = [
				['i', '1'],
				['I', '1'],
				['l', '1'],
				['L', '1'],
				['o', '0'],
				['O', '0'],
			];

			conversions.forEach(([character, replacement]) => {
				expect(subject(encoding + character), `Failed to convert ${character}`)
					.to.deep.equal(subject(encoding + replacement));
			});
		});
	});

	assertEncode({
		described_namespace,
		encoding_any,
		encoding_max,
		encoding_min,
	});
});

