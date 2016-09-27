import Textmode from 'textmode';
import Utils from './utils';
import characterSets from '../img/characters.json';

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
		super({
			canvas           : options.canvas,
			backgroundColors : [[]],
			foregroundColors : [[]],
			text             : [[]],
			characterSetMap  : [[]],
			colors           : TELETEXT_COLORS,
			characterSets    : [
				characterSets['alphanumeric'],
				characterSets['mosaic'],
				characterSets['separated']
			],
			rows : options.teletext.length,
			cols : options.teletext[0].length
		});

		this.setTeletext(options.teletext);
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
		if (typeof this.teletext[row][col] === 'undefined') {
			return SPACE_CHARACTER;
		}
		return this.teletext[row][col];
	}

	getTeletextRow(row) {
		return this.teletext[row];
	}

	_parseTeletext() {
		for (let row = 0; row < this.rows; row++) {
			this._parseRow(row);
		}
	}

	_setRowDefaults(row) {
		this.backgroundColors[row] = Array(this.cols).fill(BLACK);
		this.foregroundColors[row] = Array(this.cols).fill(WHITE);
		this.text[row] = Array(this.cols).fill(SPACE_CHARACTER);
		this.characterSetMap[row] = Array(this.cols).fill(ALPHA_NUMERIC);

		this._isHoldMosaics = false;
		this._isSeparatedMosaics = false;
	}

	_parseRow(row) {
		this._setRowDefaults(row);

		for (let col = 0; col < this.cols; col++) {
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
		for (let i = col; i < this.cols; i++) {
			this.setForegroundColor(row, i, color);
			this.setCharacterSet(row, i, characterSet);
		}
	}

	_handleNewBackground(char, row, col) {
		let color = Utils.getColor(char);
		for (let i = col; i < this.cols; i++) {
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
