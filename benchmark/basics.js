const Id128 = require('../');
const { IdFactory } = require('factory/id');

Object.values(Id128)
	.filter(x => x instanceof IdFactory)
	.sort((l, r)  => l.name.localeCompare(r.name))
	.forEach((id_type) => suite(id_type.name, function() {
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
