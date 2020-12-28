module.exports = class Info {
	constructor(buf) {
		this._buf = buf;
		this.fileCount = buf.readUInt32LE(0x0);
		this.blockSize = buf.readUInt32LE(0x4);
		this.files = [];
		for(let i = 0; i < this.fileCount; i++) {
			let file = {};
			file.data = buf.subarray(0x8 + (i*0x8), 0x10 + (i*0x8))
			file.offset = buf.readUInt32LE(0x8 + (i*0x8))// * this.blockSize;
			file.size = buf.readUInt32LE(0xC + (i*0x8));
			//if(file.size == 0)
			//	file.size = this.blockSize;
			this.files.push(file)
		}
	}
}