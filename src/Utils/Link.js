export default class Link {
	constructor(buf) {
		this._buf = buf
		this.fileCount = buf.readUInt32LE(0x4);
		this.blockSize = buf.readUInt32LE(0x8);
		this.padding = buf.readUInt32LE(0xC);
		this.files = [];
		for(let i = 0; i < this.fileCount; i++) {
			let file = {};
			file.data = buf.subarray(0x10 + (i*0x8), 0x18 + (i*0x8))
			file.offset = buf.readUInt32LE(0x10 + (i*0x8))// * this.blockSize;
			file.size = buf.readUInt32LE(0x14 + (i*0x8));
			//if(file.size == 0)
			//	file.size = this.blockSize;
			this.files.push(file)
		}
	}
}