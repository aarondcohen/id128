const Benchmarkify = require('benchmarkify');
const Id128 = require('../');
const { Uuid } = Id128;

const benchmark = new Benchmarkify("Stats").printHeader();

const id_suites = [
	Id128.Ulid,
	Id128.UlidMonotonic,
	Id128.Uuid1,
	Id128.Uuid4,
	Id128.Uuid6,
	Id128.UuidNil,
].map((id_type) => {
	const id = id_type.generate();
	const canonical = id.toCanonical();
	const raw = id.toRaw();
	const suite = benchmark.createSuite(id_type.name, { cycles: 1000000 });

	suite.add('generate:', () => id_type.generate());
	suite.add('MIN:', () => id_type.MIN());
	suite.add('MAX:', () => id_type.MAX());
	suite.add('fromCanonical:', () => id_type.fromCanonical(canonical));
	suite.add('fromCanonicalTrusted:', () => id_type.fromCanonicalTrusted(canonical));
	suite.add('fromRaw:', () => id_type.fromRaw(raw));
	suite.add('fromRawTrusted:', () => id_type.fromRawTrusted(raw));
	suite.add('toCanonical:', () => id.toCanonical());
	suite.add('toRaw:', () => id.toRaw());

	return suite;
});

const uuid_suites = Uuid.versioned_ids
	.sort((l, r)  => l.name.localeCompare(r.name))
	.map((id_type) => {
		const id = id_type.generate();
		const canonical = id.toCanonical();
		const raw = id.toRaw();
		const type = { version: id.version };

		const suite = benchmark.createSuite(
			`Uuid processing ${id_type.name}`,
			{ cycles: 1000000 }
		);

		suite.add('generate:', () => Uuid.generate(type));
		suite.add('MIN:', () => Uuid.MIN(type));
		suite.add('MAX:', () => Uuid.MAX(type));
		suite.add('fromCanonical:', () => Uuid.fromCanonical(canonical));
		suite.add('fromCanonicalTrusted:', () => Uuid.fromCanonicalTrusted(canonical));
		suite.add('fromRaw:', () => Uuid.fromRaw(raw));
		suite.add('fromRawTrusted:', () => Uuid.fromRawTrusted(raw));

		return suite;
	});

benchmark.run(id_suites.concat(uuid_suites));
