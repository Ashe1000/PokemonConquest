import BaseRandomizer from '../Classes/BaseRandomzier.js';
import Link from '../Utils/Link.js';
import Info from '../Utils/Info.js';
import Pokemon from '../Classes/Pokemon.js';
import { shuffleArr } from '../Utils/Utils.js';
import FatSection from '../Utils/FatSection.js';
//patches the sound for the randomized pokemon
function patchSDAT(buf, shuffled) {
	let fatOffset = buf.readUInt32LE(0x10);
	let fatSize = buf.readUInt32LE(0x14);
	let fat = buf.subarray(fatOffset, fatOffset + fatSize);
	let getFiles = (start, end) => {
		let files = [];
		let off = 0xC;
		for(let i = start; i < end; i += 0xc) {
			files.push(new FatSection(fat.subarray(off + i, off + i + 0xC)))
		}
		return files
	}
	let swapFiles = files => {
		shuffled.forEach((e, i) => {
			files[i].offset = files[e].data.offset
			files[i].size = files[e].data.size
			files[i].unknown = files[e].data.unknown
		});
	}
	let voice = getFiles(269, 668);
	//console.log('VOICE', voice.length);
	swapFiles(voice.filter((_, i) => i%2));
	swapFiles(voice.filter((_, i) => !(i%2)));
	let bankV = getFiles(785, 984);
	//console.log('BANK', bankV.length);
	swapFiles(bankV)
	let wavARC = getFiles(1126,1325);
	//console.log('wavARC', wavARC.length);
	swapFiles(wavARC);
	//269 - start
	//668 - end
	//2 files per voice
	//785 - start
	// 984 - end
	//1 file
	//1126 - start
	//1325 - end
}

export default class PokemonRandomizer extends BaseRandomizer {
	setup() {
		this.startPKMN = 0;
		this.type = 'pokemon';
		this.conf = ['types', 'abilities', 'moves', 'attack', 'defense', 'speed', 'hp', 'range', 'evolutions'];
	}
	init() {
		let buf = this.pokeBuf = this.readFile('/data/Pokemon.dat');
		let pokemon = this.pokemon = [];
		for (let i = 0; i < 200; i++) {
			pokemon.push(new Pokemon(buf.subarray(i * 0x30, (i * 0x30) + 0x30)));
		}
	}
	abilities() {
		let abilM = this.Managers.AbilityManager;
		let abilities = [...abilM.abilities];
		//shuffleArr(abilities);
		abilities.map((e, i) => e.id = i);
		let abilMap = [];

		let norm = abilities.filter(e => !e.name.includes('dummy'));
		let dummy = abilities.filter(e => e.name.includes('dummy'));
		[...norm, ...dummy].forEach(e => abilMap.push(e.id));
		
		let buf = Buffer.concat([...norm.map(e => e._buf), ...dummy.map(e => e._buf)], abilM._buf.length);
		abilM.reload(buf);
		abilM.save();

		this.pokemon.forEach(pkmn => {
			let amt = Math.random() * 3 + 1 | 0;
			let abils = [];
			while(amt--) {
				abils.push(Math.random() * norm.length | 0)
			}
			pkmn.ability = abils;
		});
		let scP = this.Managers.ScenariosPKMNManager;
		scP.Scenarios.forEach(sc => {
			sc.pokemon.forEach(pkmn => {
				if(pkmn.id >= 200) return; 
				let abils = this.pokemon[pkmn.id].ability;
				pkmn.ability = abilMap[abils[Math.random() * abils.length | 0]];
			});
		});
		
	}
	types({ singleChance }) {
		let types = Pokemon.types,
			len = types.length;
		this.pokemon.forEach(pkmn => {
			let type1 = types[Math.random() * len | 0];
			let type2 = types[Math.random() * len | 0];
			pkmn.type1 = type1;
			if (Math.random() > singleChance) {
				while (type2 === type1)
					type2 = types[Math.random() * len | 0];
				pkmn.type2 = type2;
			} else {
				pkmn.type2 = 'none';
			}
		});
	}
	moves() {
		this.pokemon.forEach(pkmn => {
			pkmn.move = Math.random() * 123 | 0;
		});
	}
	stat(stat, { min, max, shuffle }) {
		let stats = [];
		min = min - 1;
		max = max + 1;
		let val = max - min + 1;
		let change = n => n + (Math.random() * val | 0) - min;
		this.pokemon.forEach(pkmn => {
			let s = change(pkmn[stat]);
			if (shuffle)
				stats.push(s);
			else
				pkmn[stat] = s;
		});
		if (!shuffle) return;
		shuffleArr(stats);
		this.pokemon.forEach((pkmn, i) => {
			pkmn[stat] = stats[i]
		});
	}
	attack(conf) {
		this.stat('attack', conf)
	}
	defense(conf) {
		this.stat('defense', conf)
	}
	hp(conf) {
		this.stat('hp', conf)
	}
	speed(conf) {
		this.stat('hp', conf)
	}
	range({ data }) {
		this.pokemon.forEach(pkmn => {
			pkmn.range = data[Math.random() * data.length | 0]
		});
	}
	evolutions() {
		let shuffled = new Array(200).fill(0).map((e, i) => i);
		shuffleArr(shuffled);
		/* shuffle pokemon */
		let shuffleMap = this.shuffledMap = new Array(200);
		let shuffledPokes = shuffled.map((e, i) => (shuffleMap[e] = i, this.pokemon[e]));
		//shuffledPokes[]
		let buf = Buffer.concat([...shuffledPokes.map(e => e._buf), this.pokeBuf.subarray(0x2580)], this.pokeBuf.length);
		this.pokeBuf = buf;
		let scP = this.Managers.ScenariosPKMNManager;
		scP.Scenarios.forEach(sc => {
			sc.pokemon.forEach(pkmn => {
				//console.log(2)
				pkmn.id = shuffleMap[pkmn.id];
			});
		});
		this.startPKMN = scP.Scenarios[0].pokemon[0].id;
		/* fix sync table */
		let syncTable = this.readFile('/data/BaseBushouMaxSyncTable.dat');
		let tables = [];
		for (let i = 0; i < 252; i++) {
			let table = syncTable.subarray(200 * i, (200 * i) + 200);
			let fixedTbl = Buffer.alloc(table.length);
			let map = {};
			let read = n => {
				if (map[n])
					return map[n]
				return map[n] = table.readUInt8(n)
			}
			for (let i = 0; i < 200; i++) {
				let int = read(i);
				fixedTbl.writeUInt8(int, read(shuffled[i]))
			}
			tables.push(fixedTbl);
		}
		/*
		I commented out the line below because if you patch the
		sync table it will give people pokemon they have 0% link with
		*/
		//this.saveFile('/data/BaseBushouMaxSyncTable.dat', Buffer.concat(tables, syncTable.length));
		
		
		/* fix sprites */
		['PAC', 'DTX', 'TEX', 'ATX'].forEach(e => {
			let filePath = `/graphics/model_pokemon/POKEMON_${e}.ALL`;
			let file = new Link(this.readFile(filePath));
			let files = file.files;
			files.forEach((f, i) => {
				f.data.writeUInt32LE(files[shuffled[i]].offset, 0);
				f.data.writeUInt32LE(files[shuffled[i]].size, 4)
			})
			this.saveFile(filePath, file._buf);
		});
		let shuffleInfo = filePath => {
			let file = new Info(this.readFile(filePath));
			let files = file.files;
			files.forEach((f, i) => {
				f.data.writeUInt32LE(files[shuffled[i]].offset, 0);
				f.data.writeUInt32LE(files[shuffled[i]].size, 4)
			})
			this.saveFile(filePath, file._buf);
		}
		['b', 'l', 'm', 's', 'sr'].forEach(e => 
			shuffleInfo(`/graphics/still/stl_pokemon_${e}/StlPokemon${e.toUpperCase()}Info.dat`)
		);
		['B', 'CI', 'L', 'M', 'S', 'SR'].forEach(e =>
			shuffleInfo(`/graphics/still/stl_pokemon_${e.toLowerCase()}/StlPokemon${e}TexInfo.dat`)
		);

		/* 
			Patch voices - i think this can be done easier like everything else in this project
		*/
		let sdat = this.readFile('/snd/PSL.sdat');
		patchSDAT(sdat, shuffled);
		this.saveFile('/snd/PSL.sdat', sdat)
	}
	finalize() {
		let offset = this.shuffledMap?.[this.startPKMN] ?? 0;
		let start = this.pokeBuf.subarray(1*offset, 0x30 * offset);
		let pk = new Pokemon(start);
		pk.range = 4;
		//console.log(pk.move);
		//randomize the pokemons move
		pk.move = Math.random() * 123 | 0;
		this.saveFile('/data/Pokemon.dat', this.pokeBuf)
	}
}

