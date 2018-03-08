const Id128 = require('../');

const factory = Id128.Uuid;
factory.versioned_ids
	.sort((l, r)  => l.name.localeCompare(r.name))
	.forEach((id_type) => suite(`Uuid processing ${id_type.name}`, function() {
		set('iterations', 1000000);

		const id = id_type.generate();
		const canonical = id.toCanonical();
		const raw = id.toRaw();
		const type = { version: id.version };

		bench('generate', () => factory.generate(type));
		bench('MIN', () => factory.MIN(type));
		bench('MAX', () => factory.MAX(type));
		bench('fromCanonical', () => factory.fromCanonical(canonical));
		bench('fromCanonicalTrusted', () => factory.fromCanonicalTrusted(canonical));
		bench('fromRaw', () => factory.fromRaw(raw));
		bench('fromRawTrusted', () => factory.fromRawTrusted(raw));
	}));
