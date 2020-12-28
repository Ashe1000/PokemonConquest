const fs = require('fs');
const path = require('path');
module.exports = class Manager {
	constructor(options, buf) {
		this.path = options.basePath;
		this.savePath = options.savePath;
		buf && this.reload(buf);
	}
	reload(buf) {
		this.buf = buf;
	}
	_np(file) {
		return file.split('/').join(path.sep);
	}
	existsFile(file, p) {
		file = this._np(file);
		file = path.join(p ?? this.path, file);
		return fs.existsSync(file)
	}
	readFile(file, opts, p) {
		file = this._np(file);
		file = path.join(p ?? this.path, file);
		return fs.readFileSync(file, opts)
	}
	saveFile(file, data, opts) {
		file = this._np(file);
		file = path.join(this.savePath, file);
		fs.mkdirSync(path.dirname(file), { recursive: true });
		fs.writeFileSync(file, data, opts)
	}
}