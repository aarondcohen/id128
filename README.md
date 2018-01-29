# Id128

Generate 128-bit unique identifiers for various specifications.  In particular:
- [ULID](#ulid)
- [Monotonic ULID](#ulidmonotonic)
- [Nil UUID](#uuidnil)
- [UUID Variant 1 Version 4](#uuid4)

# Common Usage

```es6
const {
	Ulid,
	UlidMonotonic,
	Uuid4,
	UuidNil,
} = require('id128');

// Id factories
[
	Ulid,
	UlidMonotonic,
	Uuid4,
	UuidNil,
].forEach((IdType) => {
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

	// Decode a valid canonically formatted id
	console.log(id.equal(IdType.fromCanonical(canonical)));

	// Decode a canonically formatted id, skipping validation
	console.log(id.equal(IdType.fromCanonicalTrusted(canonical)));

	// Decode a valid raw formatted id
	console.log(id.equal(IdType.fromRaw(raw)));

	// Decode a raw formatted id, skipping validation
	console.log(id.equal(IdType.fromRawTrusted(raw)));
});
```

## Common Factory Methods

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
import { Ulid } from 'id128';
```

Ulid, as [specified](https://github.com/ulid/spec), has some nice properties:
- collision resistant: 80-bits of randomness
- k-ordered: prefixed with millisecond precision timestamp
- database friendly: fits within a uuid and generally appends to the index
- human friendly: canonically encodes as a case-insensitive Crockford 32 number

It is useful when you need a distributed domain unique id.

## Additional Properties

### time
Return a Date object for the epoch milliseconds encoded in the id.

## Additional Methods

### .generate(time) => id
Return a new id instance.  By default, the current time is generated on each call.
Setting `time` to `null` or `undefined` triggers the default behavior.
`time` can be given either as a `Date` object or epoch milliseconds
(milliseconds since January 1st, 1970).  For times prior to the epoch or after
approximately August 2nd, 10889, throws `InvalidSeed`. This is provided mostly
for unit tests.

## Byte Format
Format `ttttttrrrrrrrrrr` where:
- `t` is 8 bits of time
- `r` is 8 bits of random

# UlidMonotonic
```es6
import { UlidMonotonic } from 'id128';
```

UlidMonotonic is inspired by the [specification](https://github.com/ulid/spec#monotonicity):
- collision resistant: 15-bits of random seeded clock sequence plus 64-bits of randomness
- total ordered: prefixed with millisecond precision timestamp plus 15-bit clock sequence
- database friendly: fits within a uuid and generally appends to the index
- human friendly: canonically encodes as a case-insensitive Crockford 32 number

It is useful when you need to guarantee a process unique id.

## Additional Properties

### time
Return a Date object for the epoch milliseconds encoded in the id.

## Additional Methods

### .generate(time) => id
Return a new id instance.  By default, the current time is generated on each call.
Setting `time` to `null` or `undefined` triggers the default behavior.
`time` can be given either as a `Date` object or epoch milliseconds
(milliseconds since January 1st, 1970).  For times prior to the epoch or after
approximately August 2nd, 10889, throws `InvalidSeed`.  Extra caution is required
since setting a future time and subsequently calling `generate` guarantees usage
of the clock sequence.  Throws `ClockSequenceOverflow` when the clock sequence
is exhausted.  This is provided mostly for unit tests.

### .resetClockSequence()
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
a time from the past (now is so ephemeral) seeds the generator, the previous id's
time and clock sequence is used instead, incremented by 1.  This guarantees strict
local monotonicity and preserves lexical ordering and general randomness.

Given UlidMonotonic currently generates approximately 850 ids per millisecond,
the clock sequence should never overflow.  This also means the left most bit of
the clock sequence will rarely be set to 1.  However, in the unlikely event of
an overflow, id generation should be aborted.

# Uuid4
```es6
import { Uuid4 } from 'id128';
```

Uuid4 implements the [RFC 4122 random uuid specification](https://tools.ietf.org/html/rfc4122#section-4.4):

- 122 random bits
- 2 bits reserved for the variant (1)
- 4 bits reserved for the version (4)

It is useful when you need a well-supported globally unique id.

## Additional Properties

### variant
Return the variant as encoded in the id.  Should be 1.

### version
Return the version as encoded in the id.  Should be 4.

# UuidNil
```es6
import { UuidNil } from 'id128';
```

UuidNil implements the [RFC 4122 nil uuid specification](https://tools.ietf.org/html/rfc4122#section-4.1.7):

- 128 bits of glorious 0

It is useful as placeholder for other 128-bit ids.

## Additional Properties

### variant
Return the variant as encoded in the id.  Should be 0.

### version
Return the version as encoded in the id.  Should be 0.

# Motivation

Originally, I was looking for an id that is independent of the database, but plays
nice with database indices and data types.  Most databases have built-in support
for storing UUIDs efficiently, but UUID v4 fragments the index and the other UUIDs
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
- maintainable: heavily tested isoldated code with a consistent interface
- extensible: modular design to easily add new ids and new encodings

# Tests

To run the tests:
```bash
yarn test test/*
```

# Benchmarks

To run the benchmarks:
```bash
yarn install
yarn benchmark benchmark/*
```

```
                  Ulid
   1,318,776 op/s » generate
   6,773,280 op/s » MIN
  11,357,849 op/s » MAX
   1,309,111 op/s » fromCanonical
   1,546,867 op/s » fromCanonicalTrusted
   1,147,472 op/s » fromRaw
   1,411,664 op/s » fromRawTrusted
   2,603,936 op/s » toCanonical
   4,549,521 op/s » toRaw

                  UlidMonotonic
     856,812 op/s » generate
   6,233,701 op/s » MIN
   6,251,137 op/s » MAX
   1,187,556 op/s » fromCanonical
   1,364,965 op/s » fromCanonicalTrusted
   1,068,532 op/s » fromRaw
   1,257,115 op/s » fromRawTrusted
   2,122,055 op/s » toCanonical
   4,531,077 op/s » toRaw

                  Uuid4
   2,041,977 op/s » generate
   8,230,167 op/s » MIN
   8,183,125 op/s » MAX
     985,580 op/s » fromCanonical
   1,172,836 op/s » fromCanonicalTrusted
   1,093,680 op/s » fromRaw
   1,312,437 op/s » fromRawTrusted
   4,616,699 op/s » toCanonical
   3,850,641 op/s » toRaw

                  UuidNil
   6,550,963 op/s » generate
   7,924,792 op/s » MIN
   7,879,315 op/s » MAX
   1,023,658 op/s » fromCanonical
   1,163,824 op/s » fromCanonicalTrusted
   1,149,569 op/s » fromRaw
   1,365,354 op/s » fromRawTrusted
   4,664,013 op/s » toCanonical
   4,461,030 op/s » toRaw

                  Competitors
   1,366,500 op/s » Id128.Ulid
     857,560 op/s » Id128.Ulid Canonical
     878,101 op/s » Id128.UlidMonotonic
     618,274 op/s » Id128.UlidMonotonic Canonical
   2,095,413 op/s » Id128.Uuid4
   1,392,257 op/s » Id128.Uuid4 Canonical
   7,365,361 op/s » Id128.UuidNil
   2,753,044 op/s » Id128.UuidNil Canonical
     744,091 op/s » Cuid
     106,541 op/s » Ksuid
     347,503 op/s » Nanoid
     316,387 op/s » Nanoid like Uuid v4
      27,530 op/s » Ulid
   1,857,655 op/s » Ulid Monotonic
     383,997 op/s » Uuid
   1,584,366 op/s » UuidRandom
     253,459 op/s » Uuid4
      81,533 op/s » UuidJs
      47,690 op/s » UuidJs v4
      48,914 op/s » UuidJs v4 Canonical
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
