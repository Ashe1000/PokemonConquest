const BaseManager = require('../Classes/BaseManager.js');
const ScenarioPokemon = require('../Classes/ScenarioPokemon.js');
module.exports = class ScenerioPokemonManager extends BaseManager {
	constructor(options, number) {
		super(options);
		this.filename = `/data/Scenario/Scenario${number > 9 ? number : `0${number}`}/ScenarioPokemon.dat`;
		this.reload(this.readFile(this.filename));
	}
	reload(buf) {
		this._buf = buf;
		let pkmn = this.pokemon = [];
		for(let i = 0; i < buf.length / 0x8; i++) {
			pkmn.push(new ScenarioPokemon(buf.subarray(i * 0x8, (i+1) * 0x8)))
		}
	}
	save() {
		this.saveFile(this.filename, this._buf)
	}
}