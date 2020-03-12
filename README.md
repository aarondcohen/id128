# Id128

Generate 128-bit unique identifiers for various specifications.  In particular:
- [ULID](#ulid)
- [Monotonic ULID](#ulidmonotonic)
- [UUID 1 (Variant 1 Version 1)](#uuid1)
- [UUID 4 (Variant 1 Version 4)](#uuid4)
- [UUID 6 (Variant 1 Version 6)](#uuid6)
- [Nil UUID (Variant 0 Version 0)](#uuidnil)
- [Uuid (Unknown Variant and Version)](#uuid)

# Common Usage

```es6
const {
	Ulid,
	UlidMonotonic,
	Uuid,
	Uuid1,
	Uuid4,
	Uuid6,
	UuidNil,
} = require('id128');

// Id factories
[
	Ulid,
	UlidMonotonic,
	Uuid1,
	Uuid4,
	Uuid6,
	UuidNil,
].forEach((IdType) => {
	// Identify the factory
	console.log(IdType.name);

	// Generate a new id
	const id = IdType.generate();

	// Get the smallest valid id
	const min = IdType.MIN();

	// Get the largest valid id
	const max = IdType.MAX();

	// Compare ids
	console.log(id.equal(id));
	console.log(! id.equal(min));
	console.log(! id.equal(max));
	console.log(id.compare(min) === 1);
	console.log(id.compare(id) === 0);
	console.log(id.compare(max) === -1);

	// Encode the id in its canonical form
	const canonical = id.toCanonical();
	console.log(canonical);

	// Encode the id for efficient db storage
	const raw = id.toRaw();
	console.log(raw);

	// Verify a canonically formatted id
	console.log(IdType.isCanonical(canonical));

	// Decode a valid canonically formatted id
	console.log(id.equal(IdType.fromCanonical(canonical)));

	// Decode a canonically formatted id, skipping validation
	console.log(id.equal(IdType.fromCanonicalTrusted(canonical)));

	// Verify a raw formatted id
	console.log(IdType.isRaw(raw));

	// Decode a valid raw formatted id
	console.log(id.equal(IdType.fromRaw(raw)));

	// Decode a raw formatted id, skipping validation
	console.log(id.equal(IdType.fromRawTrusted(raw)));
});

// Uuid Factory
[0, 1, 4, 6].forEach((version) => {
	// Generate a new id
	const id = Uuid.generate({ version });

	// Get the smallest valid id
	const min = Uuid.MIN({ version });

	// Get the largest valid id
	const max = Uuid.MAX({ version });

	// Encode the id in its canonical form
	const canonical = id.toCanonical();
	console.log(canonical);

	// Encode the id for efficient db storage
	const raw = id.toRaw();
	console.log(raw);

	// Decode a valid canonically formatted id
	console.log(id.equal(Uuid.fromCanonical(canonical)));

	// Decode a canonically formatted id, skipping validation
	console.log(id.equal(Uuid.fromCanonicalTrusted(canonical)));

	// Decode a valid raw formatted id
	console.log(id.equal(Uuid.fromRaw(raw)));

	// Decode a raw formatted id, skipping validation
	console.log(id.equal(Uuid.fromRawTrusted(raw)));
});
```
## Common Factory Properties

### name
Return the name of the generated id type.

## Common Factory Methods

### .construct(bytes) => id
Return a new id instance without validating the bytes.

### .generate() => id
Return a new id instance.

### .MIN() => id
Return the id instance with the smallest valid value.

### .MAX() => id
Return the id instance with the largest valid value.

### .fromCanonical(canonical_string) => id
Decode an id from its canonical representation.
Throw `InvalidEncoding` if the string is undecodable.

### .fromCanonicalTrusted(canonical_string) => id
Decode an id from its canonical representation.
Skip validation and assume the input is decodable.

### .fromRaw(raw_string) => id
Decode an id from its raw representation.
Throw `InvalidEncoding` if the string is undecodable.

### .fromRawTrusted(raw_string) => id
Decode an id from its raw representation.
Skip validation and assume the input is decodable.

### .toCanonical(id) => canonical_string
Encode the given id in the canonical form.
Throw `InvalidBytes` if the id is not 128-bit conformant.

### .toRaw(id) => raw_string
Encode the given id in the raw form.
Throw `InvalidBytes` if the id is not 128-bit conformant.

### .compare(left_id, right_id) => (-1|0|1)
Determine if the left id is `less than | equal to | greater than`
the right id using lexicographical byte order.

### .equal(left_id, right_id) => (true|false)
Determine if 2 ids have the same byte value.

### .isCanonical(canonical_string) => (true|false)
Verify if a string is a valid canonical encoding.

### .isRaw(raw_string) => (true|false)
Verify if a string is a valid raw encoding.

## Common Instance Properties

### bytes
Return the actual byte array representing the id.

## Common Instance Methods

### .clone() => deep_copy
Return a new instance of the id with the same bit signature.

### .compare(other) => (-1|0|1)
Determine how this id is ordered against another.

### .equal(other) => (true|false)
Determine if this id has the same bytes as another.

### .toCanonical() => canonical_string
Encode this id in its canonical form.

### .toRaw() => raw_string
Encode this id in its raw form.

# Ulid
```es6
const { Ulid } = require('id128');
```

Ulid, as [specified](https://github.com/ulid/spec), has some nice properties:
- collision resistant: 80-bits of randomness
- k-ordered: prefixed with millisecond precision timestamp
- database friendly: fits within a uuid and generally appends to the index
- human friendly: canonically encodes as a case-insensitive Crockford 32 number

It is useful when you need a distributed domain unique id.

## Additional Instance Properties

### time
Return a Date object for the epoch milliseconds encoded in the id.

## Additional Factory Methods

### .generate({ time }) => id
Return a new id instance.  Set any argument to `null` or `undefined` to trigger
its default behavior.

`time` defaults to the current time.  It can be given either as a `Date` object
or epoch milliseconds (milliseconds since January 1st, 1970).
Throw `InvalidEpoch` for times before the epoch or after approximately August 2nd, 10889.
This is provided mostly for unit tests.

## Byte Format
Format `ttttttrrrrrrrrrr` where:
- `t` is 8 bits of time
- `r` is 8 bits of random

# UlidMonotonic
```es6
const { UlidMonotonic } = require('id128');
```

UlidMonotonic is inspired by the [specification](https://github.com/ulid/spec#monotonicity):
- collision resistant: 15-bits of random seeded clock sequence plus 64-bits of randomness
- total ordered: prefixed with millisecond precision timestamp plus 15-bit clock sequence
- database friendly: fits within a uuid and generally appends to the index
- human friendly: canonically encodes as a case-insensitive Crockford 32 number

It is useful when you need to guarantee a process unique id.

## Additional Instance Properties

### time
Return a Date object for the epoch milliseconds encoded in the id.

## Additional Factory Methods

### .generate({ time }) => id
Return a new id instance.  Set any argument to `null` or `undefined` to trigger
its default behavior.

`time` defaults to the current time.  It can be given either as a `Date` object
or epoch milliseconds (milliseconds since January 1st, 1970).  Extra caution is
required since setting a future time and subsequently calling `generate`
guarantees usage of the clock sequence.
Throw `InvalidEpoch` for times before the epoch or after approximately August 2nd, 10889.
Throw `ClockSequenceOverflow` when the clock sequence is exhausted.
This is provided mostly for unit tests.

### .reset()
Return the clock sequence to its starting position.  This is provided mostly for
unit tests.

## Byte Format
Format `ttttttccrrrrrrrr` where:
- `t` is 8 bits of time
- `c` is 8 bits of random-seeded clock sequence
- `r` is 8 bits of random

More specifically, the clock sequence is a counter.  When the first id for a new
timestamp is generated, the clock sequence is seeded with random bits and the
left-most clock sequence bit is set to 0, reserving 2^15 clock ticks.  Whenever
a time from the past seeds the generator, the previous id's time and clock sequence
are used instead, with the clock sequence incremented by 1.  This guarantees
strict local monotonicity and preserves lexical ordering and general randomness.

Without a seeded time, UlidMonotonic is unlikely to exceed the clock sequence
(the clock sequence supports generating a new id every 31 nanoseconds). However,
in the unlikely event of an overflow, id generation is aborted.

# Uuid1
```es6
const { Uuid1 } = require('id128');
```

Uuid1 implements the [RFC 4122 time specification](https://tools.ietf.org/html/rfc4122#section-4.2):
- time-based: encodes the current millisecond timestamp
- location-based: encodes the mac address of the machine

While this mostly adheres to the spec, there are a few nuances in the handling
of time.  Instead of encoding time as 100-nanoseconds since the Gregorian epoch,
48 bits encode milliseconds since the Gregorian epoch time and 12 bits count past
time collisions, resetting whenever given a new future time.  There are a few benefits:
- high precision time is unreliable in the browser so this ensures better precision
- the max supported date is now around the year 10502 instead of around 5236
- generating 4096 ids/ms (~4,000,000 ids/s) is wildly unlikely in real world uses
- in the rare  hi-res overflow, the count simply spills over to the clock sequence

## Additional Instance Properties

### clock_sequence
Return the clock sequence encoded in the id.

### hires_time
Return the number of prior ids generated while time stood still.

### node
Return the MAC address encoded in the id.

### time
Return a Date object for the epoch milliseconds encoded in the id.

### variant
Return the variant as encoded in the id.  Should be 1.

### version
Return the version as encoded in the id.  Should be 1.

## Additional Factory Methods

### .generate({ node, time }) => id
Return a new id instance.  Set any argument to `null` or `undefined` to trigger
its default behavior.

`time` defaults to the current time.  It can be given either as a `Date` object
or Gregorian milliseconds (milliseconds since October 15th, 1582).  Extra caution
is required since setting a future time and subsequently calling `generate`
guarantees usage of the hi-res counter and clock sequence.
Throw `InvalidEpoch` for times before the Gregorian epoch or after approximately May 17, 10502.
This is provided mostly for unit tests.

`node` defaults to the MAC address, or a random multicast address when the MAC
address is unavailable.  It can be given as an array of 6 bytes.

### .reset()
Return the hi-res counter to its starting position and generate a new random
clock sequence seed.  This is provided mostly for unit tests.

## Byte Format
Format `llll lnnn mmmm vhhh tccc aaaa aaaa aaaa` where:
- `l` is 4 bits of low millisecond time
- `n` is 4 bits of hi-res time
- `m` is 4 bits of mid millisecond time
- `v` is 4 bits of the version
- `h` is 4 bits of high millisecond time
- `t` is 2 bits of the variant followed by 2 bits of the clock sequence
- `c` is 4 bits of the clock sequence
- `a` is 4 bits of the machine address

# Uuid4
```es6
const { Uuid4 } = require('id128');
```

Uuid4 implements the [RFC 4122 random uuid specification](https://tools.ietf.org/html/rfc4122#section-4.4):

- 122 random bits
- 2 bits reserved for the variant (1)
- 4 bits reserved for the version (4)

It is useful when you need a well-supported globally unique id.

## Additional Instance Properties

### variant
Return the variant as encoded in the id.  Should be 1.

### version
Return the version as encoded in the id.  Should be 4.

## Byte Format
Format `rrrr rrrr rrrr vrrr trrr rrrr rrrr rrrr` where:
- `r` is 4 bits of random
- `v` is 4 bits of the version
- `t` is 2 bits of the variant followed by 2 bits of random

# Uuid6
```es6
const { Uuid6 } = require('id128');
```

Uuid6 implements this [controversial blog post](https://bradleypeabody.github.io/uuidv6/):
- time-based: encodes the current millisecond timestamp
- location-based: encodes the mac address of the machine

This is essentially the same implementation as Uuid1, however the time bits are
arranged in lexicographical order.  If you're looking for a spacial UUID that
is optimized for clustered indices, consider Uuid6 as a viable option.

## Additional Instance Properties

### clock_sequence
Return the clock sequence encoded in the id.

### hires_time
Return the number of prior ids generated while time stood still.

### node
Return the MAC address encoded in the id.

### time
Return a Date object for the epoch milliseconds encoded in the id.

### variant
Return the variant as encoded in the id.  Should be 1.

### version
Return the version as encoded in the id.  Should be 6.

## Additional Factory Methods

### .generate({ node, time }) => id
Return a new id instance.  Set any argument to `null` or `undefined` to trigger
its default behavior.

`time` defaults to the current time.  It can be given either as a `Date` object
or Gregorian milliseconds (milliseconds since October 15th, 1582).  Extra caution
is required since setting a future time and subsequently calling `generate`
guarantees usage of the hi-res counter and clock sequence.
Throw `InvalidEpoch` for times before the Gregorian epoch or after approximately May 17, 10502.
This is provided mostly for unit tests.

`node` defaults to the MAC address, or a random multicast address when the MAC
address is unavailable.  It can be given as an array of 6 bytes.

### .reset()
Return the hi-res counter to its starting position and generate a new random
clock sequence seed.  This is provided mostly for unit tests.

## Byte Format
Format `mmmm mmmm mmmm vnnn tccc aaaa aaaa aaaa` where:
- `m` is 4 bits of millisecond time
- `n` is 4 bits of hi-res time
- `v` is 4 bits of the version
- `h` is 4 bits of high millisecond time
- `t` is 2 bits of the variant followed by 2 bits of the clock sequence
- `c` is 4 bits of the clock sequence
- `a` is 4 bits of the machine address

# UuidNil
```es6
const { UuidNil } = require('id128');
```

UuidNil implements the [RFC 4122 nil uuid specification](https://tools.ietf.org/html/rfc4122#section-4.1.7):

- 128 bits of glorious 0

It is useful as placeholder for other 128-bit ids.

## Additional Instance Properties

### variant
Return the variant as encoded in the id.  Should be 0.

### version
Return the version as encoded in the id.  Should be 0.

## Byte Format
Format `0000 0000 0000 v000 t000 0000 0000 0000` where:
- `0` is 4 bits of 0
- `v` is 4 bits of the version (also 0)
- `t` is 2 bits of the variant (also 0) followed by 2 bits of 0

# Uuid
```es6
const { Uuid } = require('id128');
```

Uuid is a factory for generating and decoding UUIDs when the version is unknown
until runtime.  If the version is supported, it will produce UUIDs of the
appropriate type.  In exchange for the runtime flexibility, there is a necessary
performance degradation.  It is recommended to use this for decoding data from
uncontrolled sources rather than generating new ids.

Uuid supports all the same methods as the other ID factories.  All modifications
to typical behavior are noted below.

## Factory Properties

### versioned_ids
Return the factories of all the supported ids.

## Factory Methods

### .construct(bytes) => versioned_id
Return a new versioned id instance without validating the bytes.
Return a Uuid if an appropriate version does not exist.

### .generate({ version, ... }) => versioned_id
Return a new versioned id instance.  All additional arguments are passed through
to the associated version.
Throw `UnsupportedVersion` if no associated version exists.

### .MIN({ version }) => versioned_id
Return the versioned id instance with the smallest valid value.
Throw `UnsupportedVersion` if no associated version exists.

### .MAX({ version }) => versioned_id
Return the versioned id instance with the largest valid value.
Throw `UnsupportedVersion` if no associated version exists.

### .fromCanonical(canonical_string) => versioned_id
Decode a versioned id from its canonical representation.
Return a Uuid if an appropriate version does not exist.
Throw `InvalidEncoding` if the string is undecodable.

### .fromCanonicalTrusted(canonical_string) => versioned_id
Decode a versioned id from its canonical representation.
Return a Uuid if an appropriate version does not exist.
Skip validation and assume the input is decodable.

### .fromRaw(raw_string) => versioned_id
Decode a versioned id from its raw representation.
Return a Uuid if an appropriate version does not exist.
Throw `InvalidEncoding` if the string is undecodable.

### .fromRawTrusted(raw_string) => versioned_id
Decode a versioned id from its raw representation.
Return a Uuid if an appropriate version does not exist.
Skip validation and assume the input is decodable.

# Exceptions
```es6
const { Exception } = require('id128');
```
All exceptions are namespaced under `Exception` for clarity.

## Id128Error
```es6
const { Exception: { Id128Error } } = require('id128');
```
Base exception class for generic error catching.

## ClockSequenceOverflow
```es6
const { Exception: { ClockSequenceOverflow } } = require('id128');
```
Incrementing the clock sequence is impossible.  Should not happen unless manually seeding `#generate`.

## InvalidBytes
```es6
const { Exception: { InvalidBytes } } = require('id128');
```
Encoding something other than 16 bytes.  Likely to happen when encoding untrusted user input.

## InvalidEncoding
```es6
const { Exception: { InvalidEncoding } } = require('id128');
```
Decoding an invalid format or non-string object.  Likely to happen when decoding untrusted user input.

## InvalidEpoch
```es6
const { Exception: { InvalidEpoch } } = require('id128');
```
Generating an id with an invalid timestamp.  Should not happen unless manually seeding `#generate`.

## UnsupportedVersion
```es6
const { Exception: { UnsupportedVersion } } = require('id128');
```
Failed to find a factory for the desired version.  Likely to happen when decoding untrusted user input.

# Browser Support

This module supports browser compilation though Webpack/Browserify with a few caveats:
- Random number generation is optimized for memory usage over speed since only a
handful of ids are likely to be generated during a user's session so the overhead
of generating a page of random values has poor amortized cost.
- The browser must have native support for `crypto`.  `Math.random` is far too
insecure to support as a fallback, especially since the fallback only makes sense
for older browsers with proven security holes.  `msCrypto` is not a supported
fallback due to many of the other required features.
- The browser must support:
	* classes
	* closures
	* `const` and `let`
	* `Uint8Array`
	* `Symbol`

This library is intended for modern browsers that keep pace with Javascript's
growing ecosystem.  I philosophically object to supporting efforts of companies
to pour more money into broken browsers that only cause headaches for developers
to support.  I expect these caveats to be unnecessary within the next 5 years.

All that said, please notify me of any issues with modern browsers and I'll do
my best to support you.

# Motivation

Originally, I was looking for an id that is independent of the database, but plays
nice with database indices and data types.  Most databases have built-in support
for storing UUIDs efficiently, but UUID v4 does not cluster well and the other UUIDs
require bit manipulation to get good performance, which will likely cause future
maintenance headaches.

After a bit of research, ULID was determined to nicely solve the problem.  However,
the javascript implementation had 2 major issues:
1. lacks database support
2. it's slow, which in a single-threaded Node server is deadly

I considered sending in a patch, however I saw an opportunity for a more expressive
interface, which is typically a bit harder to modify once a project is in wide use.
There was also a clear pattern for encoding 128-bit ids into various formats,
which seems generally useful.

Ultimately, this library strives to be:
- secure: uses cryptographic randomness to ensure general uniqueness
- performant: currently one of the fastest id generators available
- maintainable: heavily tested isolated code with a consistent interface
- extensible: modular design to easily add new ids and new encodings

# Tests

To run the tests:
```bash
yarn install
yarn test-all
```

# Benchmarks

Competitive benchmarks have been moved to [benchmark-guid](https://github.com/aarondcohen/benchmark-guid)

To run the benchmarks:
```bash
yarn install
yarn benchmark-all
```

```
Platform info
=============
	Darwin 18.2.0 x64
	Node.JS: 13.1.0
	V8: 7.8.279.17-node.19
	Intel(R) Core(TM) i7-4578U CPU @ 3.00GHz × 4

Ulid
====
	generate:                  (3,773,495 rps)   (avg: 265ns)
	MIN:                      (10,973,370 rps)   (avg: 91ns)
	MAX:                      (10,632,353 rps)   (avg: 94ns)
	fromCanonical:             (1,682,872 rps)   (avg: 594ns)
	fromCanonicalTrusted:      (1,781,927 rps)   (avg: 561ns)
	fromRaw:                   (1,387,051 rps)   (avg: 720ns)
	fromRawTrusted:            (1,778,223 rps)   (avg: 562ns)
	toCanonical:               (3,308,341 rps)   (avg: 302ns)
	toRaw:                     (5,402,469 rps)   (avg: 185ns)

UlidMonotonic
=============
	generate:                  (3,244,846 rps)   (avg: 308ns)
	MIN:                       (5,906,660 rps)   (avg: 169ns)
	MAX:                       (5,779,445 rps)   (avg: 173ns)
	fromCanonical:             (1,465,037 rps)   (avg: 682ns)
	fromCanonicalTrusted:      (1,736,835 rps)   (avg: 575ns)
	fromRaw:                   (1,320,917 rps)   (avg: 757ns)
	fromRawTrusted:            (1,656,616 rps)   (avg: 603ns)
	toCanonical:               (3,255,027 rps)   (avg: 307ns)
	toRaw:                     (5,613,319 rps)   (avg: 178ns)

Uuid1
=====
	generate:                  (4,990,647 rps)   (avg: 200ns)
	MIN:                      (10,111,392 rps)   (avg: 98ns)
	MAX:                      (10,102,972 rps)   (avg: 98ns)
	fromCanonical:             (1,295,991 rps)   (avg: 771ns)
	fromCanonicalTrusted:      (1,568,558 rps)   (avg: 637ns)
	fromRaw:                   (1,311,402 rps)   (avg: 762ns)
	fromRawTrusted:            (1,659,691 rps)   (avg: 602ns)
	toCanonical:               (5,788,985 rps)   (avg: 172ns)
	toRaw:                     (5,728,554 rps)   (avg: 174ns)

Uuid4
=====
	generate:                  (4,953,310 rps)   (avg: 201ns)
	MIN:                       (5,464,391 rps)   (avg: 183ns)
	MAX:                       (5,555,808 rps)   (avg: 179ns)
	fromCanonical:             (1,239,890 rps)   (avg: 806ns)
	fromCanonicalTrusted:      (1,484,790 rps)   (avg: 673ns)
	fromRaw:                   (1,282,846 rps)   (avg: 779ns)
	fromRawTrusted:            (1,623,020 rps)   (avg: 616ns)
	toCanonical:               (5,880,410 rps)   (avg: 170ns)
	toRaw:                     (5,748,660 rps)   (avg: 173ns)

Uuid6
=====
	generate:                  (4,286,275 rps)   (avg: 233ns)
	MIN:                       (4,915,458 rps)   (avg: 203ns)
	MAX:                       (4,937,495 rps)   (avg: 202ns)
	fromCanonical:             (1,267,923 rps)   (avg: 788ns)
	fromCanonicalTrusted:      (1,545,612 rps)   (avg: 646ns)
	fromRaw:                   (1,318,774 rps)   (avg: 758ns)
	fromRawTrusted:            (1,668,548 rps)   (avg: 599ns)
	toCanonical:               (4,422,988 rps)   (avg: 226ns)
	toRaw:                     (4,824,185 rps)   (avg: 207ns)

UuidNil
=======
	generate:                  (8,300,439 rps)   (avg: 120ns)
	MIN:                       (5,048,557 rps)   (avg: 198ns)
	MAX:                       (8,304,089 rps)   (avg: 120ns)
	fromCanonical:             (1,249,884 rps)   (avg: 800ns)
	fromCanonicalTrusted:      (1,551,216 rps)   (avg: 644ns)
	fromRaw:                   (1,437,341 rps)   (avg: 695ns)
	fromRawTrusted:            (1,749,802 rps)   (avg: 571ns)
	toCanonical:               (4,296,274 rps)   (avg: 232ns)
	toRaw:                     (4,855,101 rps)   (avg: 205ns)

Uuid processing Uuid1
=====================
	generate:                  (5,013,752 rps)   (avg: 199ns)
	MAX:                       (9,032,008 rps)   (avg: 110ns)
	MIN:                      (11,310,608 rps)   (avg: 88ns)
	fromCanonical:             (1,029,006 rps)   (avg: 971ns)
	fromCanonicalTrusted:      (1,249,435 rps)   (avg: 800ns)
	fromRaw:                   (1,057,548 rps)   (avg: 945ns)
	fromRawTrusted:            (1,277,496 rps)   (avg: 782ns)

Uuid processing Uuid4
=====================
	generate:                  (4,505,300 rps)   (avg: 221ns)
	MAX:                       (5,424,698 rps)   (avg: 184ns)
	MIN:                       (5,472,017 rps)   (avg: 182ns)
	fromCanonical:               (969,261 rps)   (avg: 1μs)
	fromCanonicalTrusted:      (1,224,045 rps)   (avg: 816ns)
	fromRaw:                   (1,071,794 rps)   (avg: 933ns)
	fromRawTrusted:            (1,309,065 rps)   (avg: 763ns)

Uuid processing Uuid6
=====================
	generate:                  (4,086,474 rps)   (avg: 244ns)
	MAX:                       (5,482,620 rps)   (avg: 182ns)
	MIN:                       (5,374,116 rps)   (avg: 186ns)
	fromCanonical:             (1,020,569 rps)   (avg: 979ns)
	fromCanonicalTrusted:      (1,215,470 rps)   (avg: 822ns)
	fromRaw:                   (1,085,620 rps)   (avg: 921ns)
	fromRawTrusted:            (1,332,100 rps)   (avg: 750ns)

Uuid processing UuidNil
=======================
	generate:                  (9,478,763 rps)   (avg: 105ns)
	MAX:                       (9,218,737 rps)   (avg: 108ns)
	MIN:                       (5,246,739 rps)   (avg: 190ns)
	fromCanonical:             (1,018,739 rps)   (avg: 981ns)
	fromCanonicalTrusted:      (1,237,939 rps)   (avg: 807ns)
	fromRaw:                   (1,165,352 rps)   (avg: 858ns)
	fromRawTrusted:            (1,352,172 rps)   (avg: 739ns)
```

# Acknowledgments

Much of this library would not exist without the great work and documentation of
other engineers.  In particular:

- [ksuid](https://github.com/segmentio/ksuid): an in-depth exploration of the guid nuances
- [ulid](https://github.com/ulid/javascript): an elegant solution to a persistent problem
- [uuid-random](https://github.com/jchook/uuid-random): allocating pages of randomness is by far the biggest performance factor

# Contributing

Feel free to make a branch and send a pull request through [github](https://github.com/aarondcohen/id128)

# Issues

Please report any issues or bugs through [github](https://github.com/aarondcohen/id128/issues)
