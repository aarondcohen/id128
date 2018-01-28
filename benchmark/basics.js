const Id128 = require('../');

[
	'Ulid',
	'UlidMonotonic',
	'Uuid4',
	'UuidNil',
].forEach((id_type_name) => suite(id_type_name, function() {
  set('iterations', 1000000);

	const id_type = Id128[id_type_name];
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

