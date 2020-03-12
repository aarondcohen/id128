const Benchmarkify = require('benchmarkify');
const Id128 = require('../');

const benchmark = new Benchmarkify("UUID Processing").printHeader();
const suites_by_name = Object.fromEntries([
	'generate',
	'MIN',
	'MAX',
	'fromCanonical',
	'fromCanonicalTrusted',
	'fromRaw',
	'fromRawTrusted',
].map((name) => [name, benchmark.createSuite(name, { cycles: 100000 })]));

const factory = Id128.Uuid;
factory.versioned_ids
	.sort((l, r)  => l.name.localeCompare(r.name))
	.forEach((id_type) => {
		const name = id_type.name;
		const id = id_type.generate();
		const canonical = id.toCanonical();
		const raw = id.toRaw();
		const type = { version: id.version };

		suites_by_name.generate.add(name, () => factory.generate(type));
		suites_by_name.MIN.add(name, () => factory.MIN(type));
		suites_by_name.MAX.add(name, () => factory.MAX(type));
		suites_by_name.fromCanonical.add(name, () => factory.fromCanonical(canonical));
		suites_by_name.fromCanonicalTrusted.add(name, () => factory.fromCanonicalTrusted(canonical));
		suites_by_name.fromRaw.add(name, () => factory.fromRaw(raw));
		suites_by_name.fromRawTrusted.add(name, () => factory.fromRawTrusted(raw));
	});

benchmark.run(Object.values(suites_by_name));
