export default class Move {
	constructor(buf) {
		this._buf = buf;
	}
	get name() {
		return this._buf.toString('ascii', 0x0, 0xB)
	}
	set name(name) {
		name += '\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00';
		name = name.substr(0, 10);
		//change to shift-jis
		this._buf.write(name, 0x0, 0xA, 'ascii')
	}
	get movement() {
		
	}
}