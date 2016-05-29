"use strict";

let fs = require('fs');
let path = require('path');

const INPUT_DIR = 'src/img';
const OUTPUT_DIR = 'dist/img';
const OUT_FILE = 'characters.json';
const EXTENSION = 'png';

let files = fs.readdirSync(INPUT_DIR);
let characterSets = {};

files.forEach(function(file) {
	if (path.extname(file) !== '.' + EXTENSION) {
		return;
	}

	let pngData = fs.readFileSync(INPUT_DIR + '/' + file);
	let base64 = 'data:image/' + EXTENSION + ';base64,'
		+ pngData.toString('base64');
	let baseName = path.basename(file, '.' + EXTENSION);
	characterSets[baseName] = base64;
}, this);


if (!fs.existsSync(OUTPUT_DIR)){
	fs.mkdirSync(OUTPUT_DIR);
}

fs.writeFileSync(OUTPUT_DIR + '/' + OUT_FILE, JSON.stringify(characterSets));
