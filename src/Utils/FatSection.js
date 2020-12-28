export default class FatSection {
	constructor(buf) {
		this._buf = buf;
		this.data = {
			offset: this.offset,
			size: this.size,
			unknown: this.unknown
		}
	}
	get offset() {
		return this._buf.readUInt32LE(0x0)
	}
	set offset(off) {
		this._buf.writeUInt32LE(off, 0x0)
	}
	get size() {
		return this._buf.readUInt32LE(0x4)
	}
	set size(s) {
		this._buf.writeUInt32LE(s, 0x4)
	}
	get unknown() {
		return this._buf.readUInt32LE(0x8)
	}
	set unknown(s) {
		this._buf.writeUInt32LE(s, 0x8)
	}
}