const BYTE_RADIX = 1 << 8;

class UintConverter {
	assignUint(byte_begin, byte_end, bytes, uint) {
		let remainder;
		for (
			let
				idx = byte_end - 1,
				end = byte_begin - 1;
			idx > end ;
			--idx
		) {
			remainder = uint % BYTE_RADIX;
			uint = (uint - remainder) / BYTE_RADIX;
			bytes[idx] = remainder;
		}
	}

	extractUint(byte_begin, byte_end, bytes) {
		let uint = 0;
		for (let idx = byte_begin; idx < byte_end; ++idx) {
			uint = uint * BYTE_RADIX + bytes[idx];
		}
		return uint;
	}
}

module.exports = new UintConverter;
