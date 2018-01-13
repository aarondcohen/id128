# id128
Collection of 128-bit Id generators

## Supported Formats

- Ulid
- Nil UUID
- UUID Variant 1 Version 4

# Usage

```es6
const { Ulid, Uuid4, UuidNil } = require('id128');
```

## Shared Factory Methods
### .generate() => id
### .MIN() => id
### .MAX() => id
### .fromCanonical(canonical_string) => id
### .fromRaw(raw_string) => id
### .toCanonical(id) => canonical_string
### .toRaw(id) => raw_string
### .compare(left_id, right_id) => (-1|0|1)
### .equal(left_id, right_id) => (true|false)

## Shared Instance Properties

## Shared Instance Methods
### Properties
#### bytes
### Methods
#### .clone() => deep_copy
#### .compare(other) => (-1|0|1)
#### .equal(other) => (true|false)
#### .toRaw() => raw_string
#### .toCanonical() => canonical_string

## Ulid Instance
### Properties
#### time
## Uuid4 Instance
### Properties
#### variant
#### version
## UuidNil Instance
### Properties
#### variant
#### version
