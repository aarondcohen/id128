const { Ulid } = require('id128/ulid');
const { UlidMonotonic } = require('id128/ulid-monotonic');
const { Uuid4 } = require('id128/uuid-4');
const { UuidNil } = require('id128/uuid-nil');

[
	Ulid,
	UlidMonotonic,
	Uuid4,
	UuidNil,
].forEach((id_type) => suite(id_type.name, function() {
  set('iterations', 1000000);

	const id = id_type.generate();
	const canonical = id.toCanonical();
	const raw = id.toRaw();

	bench('generate', () => id_type.generate());
	bench('MIN', () => id_type.MIN());
	bench('MAX', () => id_type.MAX());
	bench('fromCanonical', () => id_type.fromCanonical(canonical));
	bench('fromCanonicalTrusted', () => id_type.fromCanonicalTrusted(canonical));
	bench('fromRaw', () => id_type.fromRaw(raw));
	bench('fromRawTrusted', () => id_type.fromRawTrusted(raw));
	bench('toCanonical', () => id.toCanonical());
	bench('toRaw', () => id.toRaw());
}));

