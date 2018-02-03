module.exports = Object.assign(
	Object.create(null),
	require('./ulid'),
	require('./ulid-monotonic'),
	require('./uuid-4'),
	require('./uuid-nil'),
);
