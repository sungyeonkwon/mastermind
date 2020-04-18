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

export default class Narrator {
  constructor(gameRef) {
    this.gameRef = gameRef;
  }

  set codemaker(user) {
    this._codemaker = user;
  }

  set codebreaker(user) {
    this._codebreaker = user;
  }

  // TODO: implement narrator methods.
  // getLine() {
  //   return 'I am a get line';
  // }

  // async next(step, delay = 0) {
  //   const line = this.getLine();
  //   const chatContent = await (await this.gameRef.get()).data().chatContent;

  //   setTimeout(() => {
  //     this.gameRef.update({chatContent: [...chatContent, line]});
  //   }, delay);
  // }
}

// async function promptCodeCreation(gameRef) {
//   const line = {
//     isNarration: true,
//     message: Narration.pick[0],
//     timestamp: new Date(),
//   };

//   const gameData = await (await gameRef.get()).data();
//   const chatContent = gameData.chatContent;

//   setTimeout(() => {
//     gameRef.update({chatContent: [...chatContent, line]});
//   }, CODE_PROMPT_DELAY);
// }
