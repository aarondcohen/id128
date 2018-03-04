const {
	Ulid: MyUlid,
	UlidMonotonic: MyUlidMonotonic,
	Uuid1: MyUuid1,
	Uuid4: MyUuid4,
	UuidNil: MyUuidNil,
} = require('../');
const Cuid = require('cuid');
const Ksuid = require('ksuid');
const Nanoid = require('nanoid');
const Ulid = require('ulid');
const Uuidv1 = require('uuid/v1');
const Uuidv4 = require('uuid/v4');
const UuidRandom = require('uuid-random');
const Uuid4 = require('uuid4');
const UuidJs = require('uuidjs');

suite('Competitors', function() {
  set('iterations', 100000);

	bench('Id128.Ulid', function() {
		MyUlid.generate();
	});

	bench('Id128.Ulid Canonical', function() {
		MyUlid.generate().toCanonical();
	});

	bench('Id128.UlidMonotonic', function() {
		MyUlidMonotonic.generate();
	});

	bench('Id128.UlidMonotonic Canonical', function() {
		MyUlidMonotonic.generate().toCanonical();
	});

	bench('Id128.Uuid1', function() {
		MyUuid1.generate();
	});

	bench('Id128.Uuid1 Canonical', function() {
		MyUuid1.generate().toCanonical();
	});

	bench('Id128.Uuid4', function() {
		MyUuid4.generate();
	});

	bench('Id128.Uuid4 Canonical', function() {
		MyUuid4.generate().toCanonical();
	});

	bench('Id128.UuidNil', function() {
		MyUuidNil.generate();
	});

	bench('Id128.UuidNil Canonical', function() {
		MyUuidNil.generate().toCanonical();
	});

	bench('Cuid', function() {
		Cuid();
	});

	bench('Ksuid', function() {
		Ksuid.randomSync();
	});

	bench('Nanoid', function() {
		Nanoid();
	});

	const HEX_ALPHABET = '0123456789ABCDEF';
	bench('Nanoid like Uuid v4', function() {
		Nanoid(32, HEX_ALPHABET);
	});

	bench('Ulid', function() {
		Ulid.ulid();
	});

	const ulidMonotonic = Ulid.monotonicFactory();
	bench('Ulid Monotonic', function() {
		ulidMonotonic();
	});

	bench('Uuidv1', function() {
		Uuidv1();
	});

	bench('Uuidv4', function() {
		Uuidv4();
	});

	bench('UuidRandom', function() {
		UuidRandom();
	});

	bench('Uuid4', function() {
		Uuid4();
	});

	bench('UuidJs', function() {
		UuidJs.generate();
	});

	bench('UuidJs v4', function() {
		UuidJs.genV4();
	});

	bench('UuidJs v4 Canonical', function() {
		UuidJs.genV4().toString();
	});
});
