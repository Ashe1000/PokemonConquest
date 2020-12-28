module.exports = class ScenarioPokemon {
	constructor(buf) {
		this._buf = buf;
	}
	get id() {
		return this._buf.readUInt16LE(0x0);
	}
	set id(id) {
		id = id & 0xffff;
		this._buf.writeUInt16LE(id, 0x0);
	}
	get ability() {
		let abil = this._buf.readUInt16LE(0x6) >>> 4;
		return abil & 0xFF
	}
	set ability(abil) {
		let base = this._buf.readUInt16LE(0x6) & 0xf00f;
		base = base | (abil << 4);
		this._buf.writeUInt16LE(base, 0x6);
	}
}