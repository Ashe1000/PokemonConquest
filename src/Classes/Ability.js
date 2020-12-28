module.exports = class Ability {
	constructor(buf) {
		this._buf = buf;
	}
	get name() {
		//no tghis is shiftjis
		return this._buf.toString('ascii', 0x0, 0xF)
	}
	set name(name) {
		name += '\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00';
		name = name.substr(0, 10);
		//change to shiftjis
		this._buf.write(name, 0x0, 0xE, 'ascii')
	}
}