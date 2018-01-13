const {
	Ulid: MyUlid,
	Uuid4: MyUuid4,
	UuidNil: MyUuidNil,
} = require('../');
const Ksuid = require('ksuid');
const Ulid = require('ulid');
const Uuid = require('uuid');

suite('Competitors', function() {
  set('iterations', 100000);

	bench('Id128.Ulid', function() {
		MyUlid.generate();
	});

	bench('Id128.Ulid Canonical', function() {
		MyUlid.toCanonical(MyUlid.generate());
	});

	bench('Id128.Uuid4', function() {
		MyUuid4.generate();
	});

	bench('Id128.Uuid4 Canonical', function() {
		MyUuid4.toCanonical(MyUuid4.generate());
	});

	bench('Id128.UuidNil', function() {
		MyUuidNil.generate();
	});

	bench('Id128.UuidNil Canonical', function() {
		MyUuidNil.toCanonical(MyUuidNil.generate());
	});

	bench('Ksuid', function() {
		Ksuid.randomSync();
	});

	bench('Ulid', function() {
		Ulid.ulid();
	});

	bench('Uuid', function() {
		Uuid();
	});
});
