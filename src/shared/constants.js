import {multiplyArrSize} from './utils';
import {GUESS_OPTIONS, CLUE_OPTIONS} from './config';

export const Color = {
  GREY_200: '#ccc',
  GREY_300: '#b0b0b0',
  GREY_400: '#7d7d7d',
  GREY_500: '#595959',
};

/** Temp factor for creating pegs. */
const FACTOR = 5;
export const guessArr = multiplyArrSize(GUESS_OPTIONS, FACTOR);
export const clueArr = multiplyArrSize(CLUE_OPTIONS, FACTOR);
