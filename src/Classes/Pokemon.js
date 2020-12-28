let types = ['normal', 'fire', 'water', 'electric', 'grass', 'ice', 'fighting',
'poison', 'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon',
'dark', 'steel'];
module.exports = class Pokemon {
	static types = types;
	constructor(buf) {
		this._buf = buf;
	}
	get name() {
		//no tghis is shiftjis
		return this._buf.toString('ascii', 0x0, 0xB)
	}
	set name(name) {
		name += '\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00';
		name = name.substr(0, 10);
		this._buf.write(name, 0x0, 0xA, 'ascii')
	}
	get natID() {
		return this._buf.readUInt16LE(0x12) >>> 6
	}
	set natID(id) {
		let base = this._buf.readUInt16LE(0x12) & 0x3f;
		id = id << 6;
		this._buf.writeUInt16LE(id | base, 0x12);
	}
	get ability() {
		let abilities = [];
		let group = this._buf.readUInt32LE(0x18);
		for(let i = 0; i < 3; i++) {
			if(group & 0x80)
				break;
			abilities.push(group & 0x7F);
			group = group >>> 9
		}
		return abilities;
	}
	set ability(abil) {

		let base = (this._buf.readUInt8(0x18) & 0xf8) >>> 4;
		//console.log(base);
		abil = [...abil, 0x80, 0x80, 0x80].slice(0, 3);
		let a = base;
		for(let i = 3; i--;) {
			a = a << 9;
			a |= abil[i];
		}
		this._buf.writeUInt32LE(a, 0x18)
	}
	get hp() {
		return this._buf.readUInt16LE(0xC) & 0x1FF
	}
	set hp(hp) {
		hp = hp & 0x1FF;
		let base = this._buf.readUInt16LE(0xC) & 0xFE00;
		hp = base | hp;
		this._buf.writeUInt16LE(hp, 0xC);
	}
	get attack() {
		return this._buf.readUInt16LE(0x10) & 0x1FF;
	}
	set attack(attack) {
		attack = attack & 0x1FF;
		let base = this._buf.readUInt16LE(0x10) & 0xFE00;
		attack = base | attack
		this._buf.writeUInt16LE(attack, 0x10);
	}
	get defense() {
		return (this._buf.readUInt16LE(0x11) >>> 2) & 0x1FF;
	}
	set defense(defense) {
		defense = defense & 0x1FF
		let base = this._buf.readUInt16LE(0x11) & 0xF803;
		defense = base | (defense << 2);
		this._buf.writeUInt16LE(defense, 0x11);
	}
	get speed() {
		return (this._buf.readUInt16LE(0x12) >>> 4) & 0x1FF;
	}
	set speed(speed) {
		speed = speed & 0x1FF
		let base = this._buf.readUInt16LE(0x12) & 0xE00F;
		speed = base | (speed << 4);
		this._buf.writeUInt16LE(speed, 0x12);
	}
	get type1() {
		return types[this._buf.readUInt8(0x14) & 0x1F]
	}
	set type1(type) {
		let base = this._buf.readUInt8(0x14) & 0xE0;
		type = base | types.indexOf(type);
		this._buf.writeUInt8(type, 0x14);
	}
	get type2() {
		return types[(this._buf.readUInt16LE(0x14) >> 5) & 0x1F] || 'none'
	}
	set type2(type) {
		let base = this._buf.readUInt16LE(0x14) & 0xFC1F;
		type = base | ((types.includes(type) ? types.indexOf(type) : 31) << 5);
		this._buf.writeUInt16LE(type, 0x14);
	}
	get move() {
		return (this._buf.readUInt16LE(0x15) >>> 2) & 0xf7
	}
	set move(move) {
		let base = this._buf.readUInt16LE(0x15) & 0x1fc03
		move = base | (move << 2);
		this._buf.writeUInt16LE(move, 0x15);
	}
	get range() {
		return (this._buf.readUInt8(0x1F) >>> 3) & 0b111
	}
	set range(range) {
		let base = this._buf.readUInt8(0x1F) & 0b11000111;
		range = base | (range << 3)
		this._buf.writeUInt8(range, 0x1F);
	}
}