const ALPHA_BLACK = 0x00;
const ALPHA_RED = 0x01;
const ALPHA_GREEN = 0x02;
const ALPHA_YELLOW = 0x03;
const ALPHA_BLUE = 0x04;
const ALPHA_MAGENTA = 0x05;
const ALPHA_CYAN = 0x06;
const ALPHA_WHITE = 0x07;

const MOSAICS_BLACK = 0x10;
const MOSAICS_RED = 0x11;
const MOSAICS_GREEN = 0x12;
const MOSAICS_YELLOW = 0x13;
const MOSAICS_BLUE = 0x14;
const MOSAICS_MAGENTA = 0x15;
const MOSAICS_CYAN = 0x16;
const MOSAICS_WHITE = 0x17;

const CONTIGUOUS_MOSAICS = 0x19;
const SEPARATED_MOSAICS = 0x1a;
const BLACK_BACKGROUND = 0x1c;
const NEW_BACKGROUND = 0x1d;
const HOLD_MOSAICS = 0x1e;
const RELEASE_MOSAICS = 0x1f;

const COLORS = {
	[ALPHA_BLACK]     : 0,
	[ALPHA_RED]       : 1,
	[ALPHA_GREEN]     : 2,
	[ALPHA_YELLOW]    : 3,
	[ALPHA_BLUE]      : 4,
	[ALPHA_MAGENTA]   : 5,
	[ALPHA_CYAN]      : 6,
	[ALPHA_WHITE]     : 7,
	[MOSAICS_BLACK]   : 0,
	[MOSAICS_RED]     : 1,
	[MOSAICS_GREEN]   : 2,
	[MOSAICS_YELLOW]  : 3,
	[MOSAICS_BLUE]    : 4,
	[MOSAICS_MAGENTA] : 5,
	[MOSAICS_CYAN]    : 6,
	[MOSAICS_WHITE]   : 7
};

export default class Utils {
	static generate2dArray(rows, cols, data) {
		let map = [];
		for (let i = 0; i < rows; i++) {
			map[i] = [];
			for (let j = 0; j < cols; j++) {
				map[i][j] = data;
			}
		}
		return map;
	}

	static isControlCharacter(character) {
		return character < 32;
	}

	static isColorSelector(character) {
		return (
			((ALPHA_BLACK <= character) && (character <= ALPHA_WHITE)) ||
			((MOSAICS_BLACK <= character) && (character <= MOSAICS_WHITE))
		);
	}

	static isContiguousMosaics(character) {
		return character === CONTIGUOUS_MOSAICS;
	}

	static isSeparatedMosaics(character) {
		return character === SEPARATED_MOSAICS;
	}

	static isBlackBackground(character) {
		return character === BLACK_BACKGROUND;
	}

	static isNewBackground(character) {
		return character === NEW_BACKGROUND;
	}

	static isMosaic(character) {
		return (MOSAICS_BLACK <= character) && (character <= MOSAICS_WHITE);
	}

	static isHoldMosaics(character) {
		return character === HOLD_MOSAICS;
	}

	static isReleaseMosaics(character) {
		return character === RELEASE_MOSAICS;
	}

	static getColor(character) {
		if (!Utils.isColorSelector(character)) {
			return COLORS[ALPHA_WHITE];
		}
		return COLORS[character];
	}
}
