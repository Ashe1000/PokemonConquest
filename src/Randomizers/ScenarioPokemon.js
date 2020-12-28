const BaseRandomizer = require('../Classes/BaseRandomzier.js');
module.exports = class ScenarioPokemon extends BaseRandomizer {
	setup() {
		this.type = 'scenarioPKMN'
		this.conf = ['pokemon'];
		console.log(200);
	}
	init() {
		console.log(200);
	}
	pokemon() {
		console.log(100);
		this.Managers.ScenariosPKMNManager.Scenarios.forEach(sc => {
			sc.pokemon.forEach(pkmn => {
				pkmn.id = Math.random() * 200 | 0;
			})
		})
	}
	finalize() {

	}
}