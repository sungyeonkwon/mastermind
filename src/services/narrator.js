export const NarrationMessage = {
  start: `Starting a new game, {codemaker} welcome!
    This is a chat area, you can talk during the game. <br/>
    If you are unsure about the rules. type 'rules'.`,
  pick: '{codemaker}, set your code on the bottom left.',
  confirm: 'When done, press [Y, n] here.',
  success: 'Code is broken! Well done codebreaker.',
  fail: 'Code was kept secret! The code was: ',
  rules: `
    1) One player, known as the Codemaker, that is you {codemaker}, secretly places the 4 Code Pegs in the 4
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

export const NarrationType = {
  rules: 'rules',
  start: 'start',
  pick: 'pick',
  confirm: 'confirm',
  success: 'success',
  fail: 'fail',
  next: 'next',
};

export default class Narrator {
  get codemaker() {
    return this._codemaker;
  }

  set codemaker(user) {
    this._codemaker = user;
  }

  get codebreaker() {
    return this._codebreaker;
  }

  set codebreaker(user) {
    this._codebreaker = user;
  }

  getMessage(type) {
    return NarrationMessage[type]
      .replace(/{codemaker}/gi, `[${this._codemaker}]`)
      .replace(/{codebreaker}/gi, `[${this.codebreaker}]`);
  }
}
