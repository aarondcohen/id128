const Crypto = window.crypto;

function randomBytes(size) {
	const bytes = new Uint8Array(size);
	Crypto.getRandomValues(bytes);
	return bytes;
};

module.exports = { randomBytes };
