import {multiplyArrSize} from './utils';
import {GUESS_OPTIONS, CLUE_OPTIONS} from './config';

// TODO: Dynamic calling instead of codemaker / codebreaker.
export const Narration = {
  start: `Starting a new game, welcome!
  This is a chat area, you can talk during the game.`,
  pick: [
    'Codemaker, set your code on the bottom left.',
    'Code is set! Now codebreaker, your turn to guess.',
  ],
  confirm: 'When done, press [Y, n] here.',
  success: 'Code is broken! Well done codebreaker.',
  fail: 'Code was kept secret! The code was: ',
  next: `Now, let turn around the table! Next round starts in : `,
};

export const Color = {
  GREY_200: '#ccc',
  GREY_300: '#b0b0b0',
  GREY_400: '#7d7d7d',
  GREY_500: '#595959',
};

const FACTOR = 5;
export const guessArr = multiplyArrSize(GUESS_OPTIONS, FACTOR);
export const clueArr = multiplyArrSize(CLUE_OPTIONS, FACTOR);
