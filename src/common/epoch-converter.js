const { InvalidEpoch } = require('./exception');

const MIN_MS = 0;
const MAX_MS = Math.pow(2, 48);

class EpochConverter {
	fromEpoch(origin_ms, epoch_ms) {
		return new Date(epoch_ms + origin_ms);
	}

	toEpoch(origin_ms, time = null) {
		const coerced_ms =
			time === null ? Date.now() :
			Number.isInteger(time) ? time :
			time instanceof Date ? time.getTime() :
				(() => {
					throw new InvalidEpoch(`Failed to coerce time [${time}] to epoch`);
				})();

		const epoch_ms = coerced_ms - origin_ms;

		if (epoch_ms < MIN_MS || epoch_ms >= MAX_MS) {
			const min_iso = new Date(MIN_MS + origin_ms).toISOString();
			const max_iso = new Date(MAX_MS - 1 + origin_ms).toISOString();
			throw new InvalidEpoch(`Epoch must be between ${min_iso} and ${max_iso}`);
		}

		return epoch_ms;
	}
}

module.exports = new EpochConverter;
