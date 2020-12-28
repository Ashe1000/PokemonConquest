let {Pokemon, pkmnRand} = require('./Pokemon.js');
let { Link, Info } = require('./Link.js')
const fs = require('fs');
let shuffled = (new Array(200)).fill(0).map((e, i) => i);
for (let i = shuffled.length - 1; i > 0; i--) {
	const j = Math.floor(Math.random() * (i + 1));
	[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
};
let pokemon = pkmnRand(shuffled);
let syncTable = fs.readFileSync('./fsroot/data/BaseBushouMaxSyncTable.dat');
let tables = [];
for(let i = 0; i< 252; i++) {
	let table = syncTable.subarray(200*i, (200*i) + 200);
	let fixedTbl = Buffer.alloc(table.length);
	let map = {};
	let read = n => {
		if(map[n])
			return map[n]
		return map[n] = table.readUInt8(n)
	}
	for(let i = 0; i < 200; i++) {
		let int = read(i);
		fixedTbl.writeUInt8(int, read(shuffled[i]))
	}
	tables.push(fixedTbl);
}
fs.writeFileSync('./patched/data/BaseBushouMaxSyncTable.dat', Buffer.concat(tables, syncTable.length));
['PAC', 'DTX', 'TEX', 'ATX'].forEach(e => {
	let file = new Link(`./fsroot/graphics/model_pokemon/POKEMON_${e}.ALL`);
	let files = file.files;
	files.forEach((f, i) => {
		f.data.writeUInt32LE(files[shuffled[i]].offset, 0);
		f.data.writeUInt32LE(files[shuffled[i]].size, 4)
	})
	fs.writeFileSync(`./patched/graphics/model_pokemon/POKEMON_${e}.ALL`, file._buf);
});
['b', 'l', 'm', 's', 'sr'].forEach(e => {
	let file = new Info(`./fsroot/graphics/still/stl_pokemon_${e}/StlPokemon${e.toUpperCase()}Info.dat`);
	let files = file.files;
	files.forEach((f, i) => {
		f.data.writeUInt32LE(files[shuffled[i]].offset, 0);
		f.data.writeUInt32LE(files[shuffled[i]].size, 4)
	})
	fs.writeFileSync(`./patched/graphics/still/stl_pokemon_${e}/StlPokemon${e.toUpperCase()}Info.dat`, file._buf);
});
['B', 'CI', 'L', 'M', 'S', 'SR'/*, 'Wu'*/].forEach(e => {
	let file = new Info(`./fsroot/graphics/still/stl_pokemon_${e.toLowerCase()}/StlPokemon${e}TexInfo.dat`);
	let files = file.files;
	//console.log(files.length, e);
	files.forEach((f, i) => {
		f.data.writeUInt32LE(files[shuffled[i]].offset, 0);
		f.data.writeUInt32LE(files[shuffled[i]].size, 4)
	})
	fs.writeFileSync(`./patched/graphics/still/stl_pokemon_${e.toLowerCase()}/StlPokemon${e}TexInfo.dat`, file._buf);
});
