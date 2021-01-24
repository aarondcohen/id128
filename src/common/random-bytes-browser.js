function resolveCrypto() {
	if(typeof window !== 'undefined' && window.crypto != null) {
		// UI thread
		return window.crypto;
	} else if (typeof self !== 'undefined' && self.crypto != null) {
		// Worker thread
		return self.crypto;
	} else {
		throw new Error('crypto not found');
	}
}
const Crypto = resolveCrypto();

function randomBytes(size) {
	const bytes = new Uint8Array(size);
	Crypto.getRandomValues(bytes);
	return bytes;
};

module.exports = { randomBytes };
