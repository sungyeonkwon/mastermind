import {multiplyArrSize} from './utils';
import {GUESS_OPTIONS, CLUE_OPTIONS} from './config';

// TODO: Dynamic calling instead of codemaker / codebreaker.
export const Narration = {
  start: `Starting a new game, welcome!
  This is a chat area, you can talk during the game. If you are unsure about the rules. type 'rules'.`,
  pick: [
    'Codemaker, set your code on the bottom left.',
    'Code is set! Now codebreaker, your turn to guess.',
  ],
  confirm: 'When done, press [Y, n] here.',
  success: 'Code is broken! Well done codebreaker.',
  fail: 'Code was kept secret! The code was: ',
  rules: `1) One player, known as the Codemaker, secretly places the 4 Code Pegs in the 4
  holes, which are then covered by flipping over the plastic shield to conceal them from
  the opponent's sight. The Codemaker can use any combination of the 6 colors he
  chooses. He can also use 2 or more Code Pegs of the same color if he wishes.
  <br/><br/>
  2) The other player, known as the Codebreaker, sits opposite the Codemaker and
  places Code Pegs in the 1st row of the Code Peg holes (closest to him). The
  Codebreaker is attempting to duplicate the exact colors and positions of the secret
  code.`,
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
