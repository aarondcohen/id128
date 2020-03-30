import {
	idCompare,
	idEqual,
	Exception,
	Ulid,
	UlidMonotonic,
	Uuid,
	Uuid1,
	Uuid4,
	Uuid6,
	UuidNil,
} from 'id128';

const bytes = new Uint8Array(16);
const encoded_id = "encoded-id-data";
const node = new Uint8Array([]);
const now = new Date();

const ulid = Ulid.MIN();
const ulid_monotonic = UlidMonotonic.MIN();
const uuid = Uuid.MIN({ version: 0 });
const uuid_1 = Uuid1.MIN();
const uuid_4 = Uuid4.MIN();
const uuid_6 = Uuid6.MIN();
const uuid_nil = UuidNil.MIN();

Ulid.MAX(); // $ExpectType Ulid
Ulid.MIN(); // $ExpectType Ulid
Ulid.construct(bytes); // $ExpectType Ulid
Ulid.fromCanonical(encoded_id); // $ExpectType Ulid
Ulid.fromCanonicalTrusted(encoded_id); // $ExpectType Ulid
Ulid.fromRaw(encoded_id); // $ExpectType Ulid
Ulid.fromRawTrusted(encoded_id); // $ExpectType Ulid
Ulid.generate(); // $ExpectType Ulid
Ulid.generate({ time: now }); // $ExpectType Ulid
Ulid.generate({}); // $ExpectType Ulid
Ulid.isCanonical(encoded_id); // $ExpectType boolean
Ulid.isRaw(encoded_id); // $ExpectType boolean
Ulid.name; // $ExpectType string
Ulid.type; // $ExpectType ConstructorOf<Ulid>
Ulid.toCanonical(ulid); // $ExpectType string
Ulid.toRaw(ulid); // $ExpectType string

UlidMonotonic.MAX(); // $ExpectType UlidMonotonic
UlidMonotonic.MIN(); // $ExpectType UlidMonotonic
UlidMonotonic.construct(bytes); // $ExpectType UlidMonotonic
UlidMonotonic.fromCanonical(encoded_id); // $ExpectType UlidMonotonic
UlidMonotonic.fromCanonicalTrusted(encoded_id); // $ExpectType UlidMonotonic
UlidMonotonic.fromRaw(encoded_id); // $ExpectType UlidMonotonic
UlidMonotonic.fromRawTrusted(encoded_id); // $ExpectType UlidMonotonic
UlidMonotonic.generate(); // $ExpectType UlidMonotonic
UlidMonotonic.generate({ time: now }); // $ExpectType UlidMonotonic
UlidMonotonic.generate({}); // $ExpectType UlidMonotonic
UlidMonotonic.isCanonical(encoded_id); // $ExpectType boolean
UlidMonotonic.isRaw(encoded_id); // $ExpectType boolean
UlidMonotonic.name; // $ExpectType string
UlidMonotonic.type; // $ExpectType ConstructorOf<UlidMonotonic>
UlidMonotonic.toCanonical(ulid_monotonic); // $ExpectType string
UlidMonotonic.toRaw(ulid_monotonic); // $ExpectType string

Uuid.MAX({ version: 0 }); // $ExpectType Uuid
Uuid.MAX({ version: 1 }); // $ExpectType Uuid
Uuid.MAX({ version: 4 }); // $ExpectType Uuid
Uuid.MAX({ version: 6 }); // $ExpectType Uuid
Uuid.MIN({ version: 0 }); // $ExpectType Uuid
Uuid.MIN({ version: 1 }); // $ExpectType Uuid
Uuid.MIN({ version: 4 }); // $ExpectType Uuid
Uuid.MIN({ version: 6 }); // $ExpectType Uuid
Uuid.fromCanonical(encoded_id); // $ExpectType Uuid
Uuid.fromCanonicalTrusted(encoded_id); // $ExpectType Uuid
Uuid.fromRaw(encoded_id); // $ExpectType Uuid
Uuid.fromRawTrusted(encoded_id); // $ExpectType Uuid
Uuid.generate({ node, time: now, version: 1 }); // $ExpectType Uuid
Uuid.generate({ node, time: now, version: 6 }); // $ExpectType Uuid
Uuid.generate({ version: 0 }); // $ExpectType Uuid
Uuid.generate({ version: 4 }); // $ExpectType Uuid
Uuid.isCanonical(encoded_id); // $ExpectType boolean
Uuid.isRaw(encoded_id); // $ExpectType boolean
Uuid.name; // $ExpectType string
Uuid.type; // $ExpectType ConstructorOf<Uuid>
Uuid.toCanonical(uuid); // $ExpectType string
Uuid.toCanonical(uuid_1); // $ExpectType string
Uuid.toCanonical(uuid_4); // $ExpectType string
Uuid.toCanonical(uuid_6); // $ExpectType string
Uuid.toCanonical(uuid_nil); // $ExpectType string
Uuid.toRaw(uuid); // $ExpectType string
Uuid.toRaw(uuid_1); // $ExpectType string
Uuid.toRaw(uuid_4); // $ExpectType string
Uuid.toRaw(uuid_6); // $ExpectType string
Uuid.toRaw(uuid_nil); // $ExpectType string
Uuid.versioned_ids; // $ExpectType IdFactory<Uuid>[]

Uuid1.MAX(); // $ExpectType Uuid1
Uuid1.MIN(); // $ExpectType Uuid1
Uuid1.construct(bytes); // $ExpectType Uuid1
Uuid1.fromCanonical(encoded_id); // $ExpectType Uuid1
Uuid1.fromCanonicalTrusted(encoded_id); // $ExpectType Uuid1
Uuid1.fromRaw(encoded_id); // $ExpectType Uuid1
Uuid1.fromRawTrusted(encoded_id); // $ExpectType Uuid1
Uuid1.generate(); // $ExpectType Uuid1
Uuid1.generate({ node, time: now }); // $ExpectType Uuid1
Uuid1.generate({}); // $ExpectType Uuid1
Uuid1.isCanonical(encoded_id); // $ExpectType boolean
Uuid1.isRaw(encoded_id); // $ExpectType boolean
Uuid1.name; // $ExpectType string
Uuid1.type; // $ExpectType ConstructorOf<Uuid1>
Uuid1.toCanonical(uuid_1); // $ExpectType string
Uuid1.toRaw(uuid_1); // $ExpectType string

Uuid4.MAX(); // $ExpectType Uuid4
Uuid4.MIN(); // $ExpectType Uuid4
Uuid4.construct(bytes); // $ExpectType Uuid4
Uuid4.fromCanonical(encoded_id); // $ExpectType Uuid4
Uuid4.fromCanonicalTrusted(encoded_id); // $ExpectType Uuid4
Uuid4.fromRaw(encoded_id); // $ExpectType Uuid4
Uuid4.fromRawTrusted(encoded_id); // $ExpectType Uuid4
Uuid4.generate(); // $ExpectType Uuid4
Uuid4.generate({}); // $ExpectType Uuid4
Uuid4.isCanonical(encoded_id); // $ExpectType boolean
Uuid4.isRaw(encoded_id); // $ExpectType boolean
Uuid4.name; // $ExpectType string
Uuid4.type; // $ExpectType ConstructorOf<Uuid4>
Uuid4.toCanonical(uuid_4); // $ExpectType string
Uuid4.toRaw(uuid_4); // $ExpectType string

Uuid6.MAX(); // $ExpectType Uuid6
Uuid6.MIN(); // $ExpectType Uuid6
Uuid6.construct(bytes); // $ExpectType Uuid6
Uuid6.fromCanonical(encoded_id); // $ExpectType Uuid6
Uuid6.fromCanonicalTrusted(encoded_id); // $ExpectType Uuid6
Uuid6.fromRaw(encoded_id); // $ExpectType Uuid6
Uuid6.fromRawTrusted(encoded_id); // $ExpectType Uuid6
Uuid6.generate(); // $ExpectType Uuid6
Uuid6.generate({ node, time: now }); // $ExpectType Uuid6
Uuid6.generate({}); // $ExpectType Uuid6
Uuid6.isCanonical(encoded_id); // $ExpectType boolean
Uuid6.isRaw(encoded_id); // $ExpectType boolean
Uuid6.name; // $ExpectType string
Uuid6.type; // $ExpectType ConstructorOf<Uuid6>
Uuid6.toCanonical(uuid_6); // $ExpectType string
Uuid6.toRaw(uuid_6); // $ExpectType string

UuidNil.MAX(); // $ExpectType UuidNil
UuidNil.MIN(); // $ExpectType UuidNil
UuidNil.construct(bytes); // $ExpectType UuidNil
UuidNil.fromCanonical(encoded_id); // $ExpectType UuidNil
UuidNil.fromCanonicalTrusted(encoded_id); // $ExpectType UuidNil
UuidNil.fromRaw(encoded_id); // $ExpectType UuidNil
UuidNil.fromRawTrusted(encoded_id); // $ExpectType UuidNil
UuidNil.generate(); // $ExpectType UuidNil
UuidNil.generate({}); // $ExpectType UuidNil
UuidNil.isCanonical(encoded_id); // $ExpectType boolean
UuidNil.isRaw(encoded_id); // $ExpectType boolean
UuidNil.name; // $ExpectType string
UuidNil.type; // $ExpectType ConstructorOf<UuidNil>
UuidNil.toCanonical(uuid_nil); // $ExpectType string
UuidNil.toRaw(uuid_nil); // $ExpectType string

ulid + ''; // $ExpectType string
ulid.bytes; // $ExpectType Uint8Array
ulid.clone(); // $ExpectType Ulid
ulid.compare(ulid); // $ExpectType number
ulid.equal(ulid); // $ExpectType boolean
ulid.time; // $ExpectType Date
ulid.toCanonical(); // $ExpectType string
ulid.toRaw(); // $ExpectType string
ulid instanceof Ulid.type; // $ExpectType boolean

ulid_monotonic + ''; // $ExpectType string
ulid_monotonic.bytes; // $ExpectType Uint8Array
ulid_monotonic.clone(); // $ExpectType UlidMonotonic
ulid_monotonic.compare(ulid_monotonic); // $ExpectType number
ulid_monotonic.equal(ulid_monotonic); // $ExpectType boolean
ulid_monotonic.time; // $ExpectType Date
ulid_monotonic.toCanonical(); // $ExpectType string
ulid_monotonic.toRaw(); // $ExpectType string
ulid_monotonic instanceof UlidMonotonic.type; // $ExpectType boolean

uuid_1 + ''; // $ExpectType string
uuid_1.bytes; // $ExpectType Uint8Array
uuid_1.clock_sequence; // $ExpectType number
uuid_1.clone(); // $ExpectType Uuid1
uuid_1.compare(uuid_1); // $ExpectType number
uuid_1.equal(uuid_1); // $ExpectType boolean
uuid_1.hires_time; // $ExpectType number
uuid_1.node; // $ExpectType Uint8Array
uuid_1.time; // $ExpectType Date
uuid_1.toCanonical(); // $ExpectType string
uuid_1.toRaw(); // $ExpectType string
uuid_1.variant; // $ExpectType number
uuid_1.version; // $ExpectType number
uuid_1 instanceof Uuid1.type; // $ExpectType boolean

uuid_4 + ''; // $ExpectType string
uuid_4.bytes; // $ExpectType Uint8Array
uuid_4.clone(); // $ExpectType Uuid4
uuid_4.compare(uuid_4); // $ExpectType number
uuid_4.equal(uuid_4); // $ExpectType boolean
uuid_4.toCanonical(); // $ExpectType string
uuid_4.toRaw(); // $ExpectType string
uuid_4.variant; // $ExpectType number
uuid_4.version; // $ExpectType number
uuid_4 instanceof Uuid4.type; // $ExpectType boolean

uuid_6 + ''; // $ExpectType string
uuid_6.bytes; // $ExpectType Uint8Array
uuid_6.clock_sequence; // $ExpectType number
uuid_6.clone(); // $ExpectType Uuid6
uuid_6.compare(uuid_6); // $ExpectType number
uuid_6.equal(uuid_6); // $ExpectType boolean
uuid_6.hires_time; // $ExpectType number
uuid_6.node; // $ExpectType Uint8Array
uuid_6.time; // $ExpectType Date
uuid_6.toCanonical(); // $ExpectType string
uuid_6.toRaw(); // $ExpectType string
uuid_6.variant; // $ExpectType number
uuid_6.version; // $ExpectType number
uuid_6 instanceof Uuid6.type; // $ExpectType boolean

uuid_nil + ''; // $ExpectType string
uuid_nil.bytes; // $ExpectType Uint8Array
uuid_nil.clone(); // $ExpectType UuidNil
uuid_nil.compare(uuid_nil); // $ExpectType number
uuid_nil.equal(uuid_nil); // $ExpectType boolean
uuid_nil.toCanonical(); // $ExpectType string
uuid_nil.toRaw(); // $ExpectType string
uuid_nil.variant; // $ExpectType number
uuid_nil.version; // $ExpectType number
uuid_nil instanceof UuidNil.type; // $ExpectType boolean

idCompare(ulid, uuid_nil); // $expectType number
idEqual(ulid, uuid_nil); // $expectType boolean

new Error() instanceof Exception.Id128Error; // $ExpectType boolean
new Error() instanceof Exception.ClockSequenceOverflow; // $ExpectType boolean
new Error() instanceof Exception.InvalidBytes; // $ExpectType boolean
new Error() instanceof Exception.InvalidEncoding; // $ExpectType boolean
new Error() instanceof Exception.InvalidEpoch; // $ExpectType boolean
new Error() instanceof Exception.UnsupportedVersion; // $ExpectType boolean
