import BaseRandomizer from '../Classes/BaseRandomzier.js';

export default class ScenarioPokemon extends BaseRandomizer {
	setup() {
		this.type = 'scenarioPKMN'
		this.conf = ['pokemon'];
	}
	init() {
		//console.log(200);
	}
	pokemon() {
		this.Managers.ScenariosPKMNManager.Scenarios.forEach(sc => {
			sc.pokemon.forEach(pkmn => {
				pkmn.id = Math.random() * 200 | 0;
			})
		})
	}
	finalize() {

	}
}