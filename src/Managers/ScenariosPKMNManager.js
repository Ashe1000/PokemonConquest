const ScenarioPokemonManager = require('./ScenarioPokemonManager.js');
module.exports = class ScenariosPKMNManager {
	constructor(options) {
		this.options = options;
		let sc = this.Scenarios = [];
		for (let i = 0; i < 11; i++) {
			sc.push(new ScenarioPokemonManager(options, i))
		}
	}
	save() {
		this.Scenarios.forEach(e => e.save())
	}
}