const Benchmarkify = require('benchmarkify');
const Id128 = require('../');
const { IdFactory } = require('../utils');
const { VersionedIdFactory } = require('../utils');

const benchmark = new Benchmarkify("Basics").printHeader();
const suites_by_name = Object.fromEntries([
	'generate',
	'MIN',
	'MAX',
	'fromCanonical',
	'fromCanonicalTrusted',
	'fromRaw',
	'fromRawTrusted',
	'toCanonical',
	'toRaw'
].map((name) => [name, benchmark.createSuite(name, { cycles: 100000 })]));

Object.values(Id128)
	.filter(x => x instanceof IdFactory)
	.filter(x => !(x instanceof VersionedIdFactory))
	.sort((l, r)  => l.name.localeCompare(r.name))
	.forEach((id_type) => {
		const name = id_type.name;
		const id = id_type.generate();
		const canonical = id.toCanonical();
		const raw = id.toRaw();

		suites_by_name.generate.add(name, () => id_type.generate());
		suites_by_name.MIN.add(name, () => id_type.MIN());
		suites_by_name.MAX.add(name, () => id_type.MAX());
		suites_by_name.fromCanonical.add(name, () => id_type.fromCanonical(canonical));
		suites_by_name.fromCanonicalTrusted.add(name, () => id_type.fromCanonicalTrusted(canonical));
		suites_by_name.fromRaw.add(name, () => id_type.fromRaw(raw));
		suites_by_name.fromRawTrusted.add(name, () => id_type.fromRawTrusted(raw));
		suites_by_name.toCanonical.add(name, () => id.toCanonical());
		suites_by_name.toRaw.add(name, () => id.toRaw());
	});

benchmark.run(Object.values(suites_by_name));
