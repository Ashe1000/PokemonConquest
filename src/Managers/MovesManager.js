
/*
This is how knockback is calculated
The middle, 00, would be like (0,0) on a grid. And as the value increases it spirals outwards
2E 2F 30 19 1A 1B 1C
2D 17 18 09 0A 0B 1D
2C 16 08 01 02 0C 1E
2B 15 07 00 03 0D 1F
2A 14 06 05 04 0E 20
29 13 12 11 10 0F 21
28 27 26 25 24 23 22

*/
//should go from knockback value to an array with [x, y]
let findXY = val => {
	
}
//goes from (x,y) -> knockback value
let findVal = (x, y) => {
	let layer = Math.max(Math.abs(x), Math.abs(y));
	let posX = 0;
	let posY = layer;
	let value = ((layer - 1) * 2 + 1) ** 2;
	let size = layer * 2 + 1;
	let check = (n, n1, n2, n3, k) => {
		let doVal = n >= n1 && n2 === n3;
		return (value += doVal ? n - n1 : k ?? size - 1, doVal)
	}
	if (check(x, posX, y, posY, layer))
		return value;
	posX = layer;
	if (check(posY, y, posX, x))
		return value;
	posY = -layer;
	if (check(posX, x, posY, y))
		return value;
	posX = -layer;
	if (check(y, posY, x, posX))
		return value;
	return value + size - 1 + x - posX;
}

//this is outdated
let findValOG = (x, y) => {
	let layer = Math.max(Math.abs(x), Math.abs(y));
	let posX = 0;
	let posY = layer;
	let value = ((layer - 1) * 2 + 1) ** 2;
	let size = layer * 2 + 1;
	let addValues = [[1,0], [0,-1], [-1, 0], [0,1], [1,0]];
	let index = 0;
	let counter = size / 2 + 1 | 0;
	while(posX !== x || posY !== y) {
		value++;
		if(counter === size) {
			counter = 1;
			index++;
		}
		counter++;
		posX += addValues[index][0];
		posY += addValues[index][1];
	}
	return value;
}



/*
205331C == end

19 00 C0 0B EF BD 47 01
19 00 22 1D EF BD 47 01
19 00 2A 03 EF BD 47 01
19 00 FC 03 EF BD 47 01
19 00 FC 03 EF BD 47 01
19 00 FC 03 EF BD 47 01
*/