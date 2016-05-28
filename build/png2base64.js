"use strict";

let fs = require('fs');
let path = require('path');

const INPUT_DIR = 'src/img';
const OUTPUT_DIR = 'dist/img';

let files = fs.readdirSync(INPUT_DIR);
let characterSets = {};

files.forEach(function(file) {
	let pngData = fs.readFileSync(INPUT_DIR + '/' + file);
	let base64 = 'data:image/png;base64,' + pngData.toString('base64');
	let baseName = path.basename(file, '.png');
	characterSets[baseName] = base64;
}, this);


if (!fs.existsSync(OUTPUT_DIR)){
	fs.mkdirSync(OUTPUT_DIR);
}

fs.writeFileSync(OUTPUT_DIR + '/' + 'characters.json', JSON.stringify(characterSets));