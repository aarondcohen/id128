const ByteArray = require('common/byte-array');

let count = 0
let result = null;
let now = new Date;
try {
	while (++count) {
		result = ByteArray.generateRandomFilled();
		result = null

		if (!(count % 10000000)) {
			global.gc && global.gc();
			const used = process.memoryUsage();
			console.log(`Runs: ${count}`)
			for (let key in used) {
				console.log(`${key} ${Math.round(used[key] / 1024 * 100) / 100} KB`);
			}
		}
	}
} catch (err) {
	const end = new Date;
	console.log(err);
	console.log([String(count).padStart(12), ...result].join(':'));
	console.log(`Time: ${end - now}, ${count/(end - now)}ops/ms`);
}
