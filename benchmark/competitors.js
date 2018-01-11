const { Ulid: MyUlid } = require('../');
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
