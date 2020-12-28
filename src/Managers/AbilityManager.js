import fs from 'fs';
import path from 'path';

import Ability from '../Classes/Ability.js';
import Manager from '../Classes/BaseManager.js';

export default class AbilManager extends Manager {
	constructor(options) {
		super(options);
		this.reload(this.readFile('/data/Tokusei.dat'));
	}
	reload(abilBuf) {
		this._buf = abilBuf;
		let abils = this.abilities = [];
		for(let i = 0; i < 128; i++) {
			let buf = abilBuf.subarray(i * 20, (i+1) * 20);
			abils.push(new Ability(buf));
		}
	}
	save(buf) {
		this.saveFile('/data/Tokusei.dat', buf ?? this._buf)
	}
}
/*module.exports = class AbilityManager {
	constructor(options) {
		this.path = options.basePath;
		this.savePath = options.savePath
		console.log(options)
		// this.existsFile('../patched/data/Tokusei.dat') ? '../patched/data/Tokusei.dat' :
		let abilBuf = this._buf = this.readFile('/data/Tokusei.dat');
		let abils = this.abilities = [];
		for(let i = 0; i < 128; i++) {
			let buf = abilBuf.subarray(i * 20, (i+1) * 20);
			abils.push(new Ability(buf));
		}
	}
	save(buf) {
		this.saveFile('/data/Tokusei.dat', buf)
	}
	_np(file) {
		return file.split('/').join(path.sep);
	}
	existsFile(file, p) {
		file = this._np(file);
		file = path.join( p ?? this.path, file);
		return fs.existsSync(file)
	}
	readFile(file, opts) {
		file = this._np(file);
		file = path.join(this.path, file);
		return fs.readFileSync(file, opts)
	}
	saveFile(file, data, opts) {
		file = this._np(file);
		file = path.join(this.savePath, file);
		fs.mkdirSync(path.dirname(file), { recursive: true });
		fs.writeFileSync(file, data, opts)
	}
}*/