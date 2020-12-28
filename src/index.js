import options from './Utils/Opts.js';

import abilManager from './Managers/AbilityManager.js';
import scenarioPKMNManager from './Managers/ScenariosPKMNManager.js';

import ScenarioPokemonRandomizer from './Randomizers/ScenarioPokemon.js';
import PokemonRandomizer from './Randomizers/Pokemon.js';

const AbilityManager = new abilManager(options);
const ScenariosPKMNManager = new scenarioPKMNManager(options);

const Managers = {
	AbilityManager,
	ScenariosPKMNManager
};

new ScenarioPokemonRandomizer(options, Managers);
new PokemonRandomizer(options, Managers);

Object.values(Managers).forEach(Manager => {
	Manager.save();
})