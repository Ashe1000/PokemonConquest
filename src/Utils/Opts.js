export default {
	pokemon: {
		//Done
		enabled: true,
		evolutions: true,
		attack: {
			enabled: true,
			shuffle: true,
			max: 25,
			min: -25
		},
		defense: {
			enabled: true,
			shuffle: true,
			max: 25,
			min: -25
		},
		speed: {
			enabled: true,
			shuffle: true,
			max: 25,
			min: -25
		},
		hp: {
			enabled: true,
			shuffle: true,
			max: 25,
			min: -25
		},
		range: {
			enabled: true,
			data: [4,4,3,3,3,3,2,2,2,1,1]
		},
		types: {
			enabled: true,
			singleChance: 0.4
		},
		//Todo
		moves: {
			enabled: true,
			userTypeChance: {
				enabled: false,
				value: 0.5
			}
		},
		abilities: true,
		updateText: true
	},
	scenarioPKMN: {
		pokemon: {
			enabled:true,
			data: 1
		},
		enabled: true
	},
	basePath: './fsroot/',
	savePath: './patched/'
}