const fs = require('fs');
const path = require('path');
const Manager = require('./BaseManager.js');
module.exports = class BaseRandomizer extends Manager {
	constructor(options, Managers) {
		super(options);
		this.setup();
		this.options = options[this.type];
		this._options = options;
		this.Managers = Managers;
		if(!this.options.enabled) return;
		this.init();
		this.conf.forEach(opt => {
			let conf = this.getOpt(opt);
			if(!conf) return;
			this[opt](conf);
		});
		this.finalize();
	}
	init() {}
	finalize() {}
	getOpt(option, base) {
		if(!base)
			base = this.options;
		let opt = base[option];
		return opt ? (opt = {...opt}, delete opt.enabled, opt) : false 
	}
}