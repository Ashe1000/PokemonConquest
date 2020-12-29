/*
30 19 1A 1B 1C 1D 1E
2F 18 09 0A 0B 0C 1F
2E 17 08 01 02 0D 20
2D 16 07 00 03 0E 21
2C 15 06 05 04 0F 22
2B 14 13 12 11 10 23
2A 29 28 27 26 25 24

0 
8
16
24

48 25 26 27 28 29 30
47 24 09 10 11 12 31
46 23 08 01 02 13 32
45 22 07 00 03 14 33
44 21 06 05 04 15 34
43 20 19 18 17 16 35
42 41 40 39 38 37 36
*/
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
17 18 09 0A 0B 1D
2C 16 08 01 02 0C
2B 15 07 00 03 0D
2A 14 06 05 04 0E
29 13 12 11 10 0F
*/

//value into [x,y]
let findXY = val => {
	
	//get the Math.max(Math.abs(x), Math.abs(y))
	let layer = Math.round((Math.sqrt(val) | 0) / 2);
	//get the area of the layer under this one
	let offset = (layer * 2 - 1) ** 2;
	//get the amount of points on the layer
	let perimeter = layer * 8;
	
	/*
		get the amount of positions on a face (faces are oriented like this)
		0 0 3
		1 - 3
		1 2 2
	*/
	let faceSize = layer * 2;

	/*
	offset the input by the area of the prev layer
	*/
	let n = (val - offset + layer + 1) % perimeter;

	// get what face the number is on (face number is changed by 1 so math works out better)
	let face = (((perimeter - n) / faceSize | 0) + 1) % 4;
	//calculate the triangle wave stuff
	let triWave = Math.round(faceSize / Math.PI * Math.asin(Math.sin(Math.PI / faceSize * (n - perimeter - layer - 1))));
	if(face % 2) {
		let mult = (face - 3) / 2 || 1;
		return [mult * layer | 0, mult * triWave | 0]
	}
	let mult = -face / 2 || 1;
	return [mult * triWave | 0, mult * layer]
}

//goes from (x,y) -> knockback value
//i also think its bugged? but i might have patched it
let findVal = (x, y) => {
	let layer = Math.max(Math.abs(x), Math.abs(y));
	if(layer === 0)
		return 0;
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

let findValOG = (x, y) => {
	let layer = Math.max(Math.abs(x), Math.abs(y));
	if(layer === 0)
		return 0;
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