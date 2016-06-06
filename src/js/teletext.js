import Textmode from 'textmode';
import Utils from './utils';
import characterSets from '../img/characters.json';
import imagesloaded from 'imagesloaded';

const BLACK = 0;
const RED = 1;
const GREEN = 2;
const YELLOW = 3;
const BLUE = 4;
const MAGENTA = 5;
const CYAN = 6;
const WHITE = 7;

const TELETEXT_COLORS = [
	'#000000',
	'#ff0000',
	'#00ff00',
	'#ffff00',
	'#0000ff',
	'#ff00ff',
	'#00ffff',
	'#ffffff'
];

const ALPHA_NUMERIC = 0;
const CONTIGUOUS_MOSAICS = 1;
const SEPARATED_MOSAICS = 2;

const SPACE_CHARACTER = 0x20;

export default class Teletext extends Textmode {
	constructor(options) {
		let rows = options.teletext.length;
		let cols = options.teletext[0].length;

		super({
			canvas           : options.canvas,
			backgroundColors : Utils.generate2dArray(rows, cols, BLACK),
			foregroundColors : Utils.generate2dArray(rows, cols, WHITE),
			text             : Utils.generate2dArray(rows, cols, SPACE_CHARACTER),
			characterSetMap  : Utils.generate2dArray(rows, cols, ALPHA_NUMERIC),
			colors           : TELETEXT_COLORS
		});

		this.setTeletext(options.teletext);
	}

	renderLetterSprites() {
		let alphanumeric = new Image();
		let mosaic = new Image();
		let separated = new Image();
		alphanumeric.src = characterSets['alphanumeric'];
		mosaic.src = characterSets['mosaic'];
		separated.src = characterSets['separated'];

		imagesloaded([alphanumeric, mosaic, separated], () => {
			super.renderLetterSprites([alphanumeric, mosaic, separated], TELETEXT_COLORS);
			this.ready = true;
			this.render();
		});
	}

	render() {
		if (!this.ready) {
			return;
		}
		super.render();
	}

	setTeletext(text) {
		this.teletext = text;
		this._parseTeletext();
	}

	setTeletextChar(row, col, character) {
		this.teletext[row][col] = character;
		this._parseRow(row);
	}

	getTeletextChar(row, col) {
		return this.teletext[row][col];
	}

	getTeletextRow(row) {
		return this.teletext[row];
	}

	_parseTeletext() {
		this.backgroundColors = [];
		this.foregroundColors = [];
		this.text = [];
		this.characterSetMap = [];
		this.longestRow = 0;
		for (let row = 0; row < this.teletext.length; row++) {
			this._parseRow(row);
		}
	}

	_setRowDefaults(row) {
		let length = this.getTeletextRow(row).length;

		this.backgroundColors[row] = Array(length).fill(BLACK);
		this.foregroundColors[row] = Array(length).fill(WHITE);
		this.text[row] = Array(length).fill(SPACE_CHARACTER);
		this.characterSetMap[row] = Array(length).fill(ALPHA_NUMERIC);

		this._isHoldMosaics = false;
		this._isSeparatedMosaics = false;
	}

	_parseRow(row) {
		let length = this.getTeletextRow(row).length;

		this._setRowDefaults(row);

		for (let col = 0; col < length; col++) {
			let char = this.getTeletextChar(row, col);

			if (Utils.isControlCharacter(char)) {
				this._handleControlCharacter(char, row, col);
				if (this._isHoldMosaics && (col - 1) >= 0) {
					char = this.getTeletextChar(row, col - 1);
				}
				else {
					char = SPACE_CHARACTER;
				}
			}

			this.setCharacter(row, col, char);
		}

		if (length > this.getTeletextRow(this.longestRow).length) {
			this.longestRow = row;
		}
	}

	_handleControlCharacter(char, row, col) {
		if (Utils.isColorSelector(char)) {
			this._handleColorSelector(char, row, col)
		}
		else if (Utils.isNewBackground(char)) {
			this._handleNewBackground(char, row, col);
		}
		else if (Utils.isBlackBackground(char)) {
			this._handleBlackBackground(char, row, col);
		}
		else if (Utils.isSeparatedMosaics(char)) {
			this._handleSeparatedMosaics(char, row, col);
		}
		else if (Utils.isContiguousMosaics(char)) {
			this._handleContiguousMosaics(char, row, col);
		}
		else if (Utils.isHoldMosaics(char)) {
			this._handleHoldMosaics(char);
		}
		else if (Utils.isReleaseMosaics(char)) {
			this._handleReleaseMosaics(char);
		}
	}

	_handleColorSelector(char, row, col) {
		let color = Utils.getColor(char);
		let characterSet = Utils.isMosaic(char)
			? (this._isSeparatedMosaics ? SEPARATED_MOSAICS : CONTIGUOUS_MOSAICS)
			: ALPHA_NUMERIC;
		let rowLength = this.getTeletextRow(row).length;
		for (let i = col; i < rowLength; i++) {
			this.setForegroundColor(row, i, color);
			this.setCharacterSet(row, i, characterSet);
		}
	}

	_handleNewBackground(char, row, col) {
		for (let i = col; i < row; i++) {
			this.setBackgroundColor(row, i, this.getForegroundColor(row, col));
		}
	}

	_handleBlackBackground(char, row, col) {
		for (let i = col; i < row; i++) {
			this.setBackgroundColor(row, i, BLACK);
		}
	}

	_handleSeparatedMosaics(char, row, col) {
		this._isSeparatedMosaics = true;
	}

	_handleContiguousMosaics(char, row, col) {
		this._isSeparatedMosaics = false;
	}

	_handleHoldMosaics(char, row, col) {
		this._isHoldMosaics = true;
	}

	_handleReleaseMosaics(char, row, col) {
		this._isHoldMosaics = false;
	}
}
