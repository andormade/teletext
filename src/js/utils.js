import {ALPHA_BLACK, ALPHA_RED, ALPHA_GREEN, ALPHA_YELLOW, ALPHA_BLUE,
	ALPHA_MAGENTA, ALPHA_CYAN, ALPHA_WHITE, MOSAICS_BLACK, MOSAICS_RED,
	MOSAICS_GREEN, MOSAICS_YELLOW, MOSAICS_BLUE, MOSAICS_MAGENTA,
	MOSAICS_CYAN, MOSAICS_WHITE, CONTIGUOUS_MOSAICS, SEPARATED_MOSAICS,
	BLACK_BACKGROUND, NEW_BACKGROUND, HOLD_MOSAICS,
	RELEASE_MOSAICS} from './constants';

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
			((ALPHA_BLACK <= character) &&
			(character <= ALPHA_WHITE)) ||
			((MOSAICS_BLACK <= character) &&
			(character <= MOSAICS_WHITE))
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
