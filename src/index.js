const options = require('./Utils/Opts.js');

const ScenarioPokemonRandomizer = require('./Randomizers/ScenarioPokemon.js');
const PokemonRandomizer = require('./Randomizers/Pokemon.js');

const AbilityManager = new (require('./Managers/AbilityManager.js'))(options);
const ScenariosPKMNManager = new (require('./Managers/ScenariosPKMNManager.js'))(options);

const Managers = {
	AbilityManager,
	ScenariosPKMNManager
};

new ScenarioPokemonRandomizer(options, Managers);
new PokemonRandomizer(options, Managers);

Object.values(Managers).forEach(Manager => {
	Manager.save();
})