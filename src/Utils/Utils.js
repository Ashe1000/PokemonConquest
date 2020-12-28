module.exports.shuffleArr = array => {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.random() * (i + 1) | 0;
		[array[i], array[j]] = [array[j], array[i]];
	}
}