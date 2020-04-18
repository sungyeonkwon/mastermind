import {GameConfig} from '../shared/config';
import {Narration, Color} from '../shared/constants';
import {firestore} from './firebase';
import {setRoomParam} from '../shared/utils';

const CODE_PROMPT_DELAY = 5000;

export async function updateGame(
  gameRef,
  type,
  value,
  rowIndex,
  columnIndex,
  spotType
) {
  const gameData = await (await gameRef.get()).data();
  const roundData = gameData.roundArr[gameData.currentRound];
  const newRowArr = [...roundData.rowArr];
  const newCodeArr = [...roundData.codeArr];

  if (type === 'guess' && spotType === 'guess') {
    newRowArr[rowIndex].guessArr[columnIndex] = value;
  } else if (type === 'clue' && spotType === 'clue') {
    newRowArr[rowIndex].clueArr[columnIndex] = value;
  } else if (type === 'guess' && spotType === 'code') {
    newCodeArr[columnIndex] = value;
  }
  roundData.rowArr = newRowArr;
  roundData.codeArr = newCodeArr;

  gameRef.update({
    roundArr: [...gameData.roundArr],
  });
}

export async function joinGame(
  _event,
  joinRoomId,
  user,
  setGameRef,
  setGameDoc,
  history
) {
  // TODO: Ensure the user is not the same as player one.
  if (!user) return;

  const gameRef = await firestore.doc(`games/${joinRoomId}`);
  const gameDoc = await gameRef.get();
  const gameData = gameDoc.data();

  const roundOne = {...gameData.roundArr[0]};
  const roundOneUpdated = {
    ...roundOne,
    codemaker: roundOne.codemaker ? roundOne.codemaker : user,
    codebreaker: roundOne.codebreaker ? roundOne.codebreaker : user,
  };

  await gameRef.update({
    ...gameData,
    playerTwo: user,
    roundArr: [roundOneUpdated],
  });

  // Push the gameRef to the user game array.
  await firestore.doc(`users/${user.uid}`).update({gameRefArr: [gameRef]});

  // Push room query string to url.
  const url = setRoomParam({room: joinRoomId});
  joinRoomId && url && history.push(`game?${url}`);

  // Update gameRef.
  setGameRef(gameRef);
  setGameDoc(gameDoc);
}

export async function startGame(gameRef, setGameRef, history, setGameDoc) {
  // Push room query string to url.
  const url = setRoomParam({room: gameRef.id});
  gameRef.id && url && history.push(`game?${url}`);

  // Save the gameRef object to the game provider state.
  const gameDoc = await gameRef.get();
  setGameRef(gameRef);
  setGameDoc(gameDoc);

  // Encourage code creation
  promptCodeCreation(gameRef);
}

async function promptCodeCreation(gameRef) {
  const line = {
    isNarration: true,
    message: Narration.pick[0],
    timestamp: new Date(),
  };

  const gameData = await (await gameRef.get()).data();
  const chatContent = gameData.chatContent;

  setTimeout(() => {
    gameRef.update({chatContent: [...chatContent, line]});
  }, CODE_PROMPT_DELAY);
}

/** Store gameRef to gameRef array on the user document. */
export async function setUserGameRef(user, gameRef) {
  const userRef = await firestore.doc(`users/${user.uid}`).get();
  const gameRefArr = await userRef.data().gameRefArr;
  firestore
    .doc(`users/${user.uid}`)
    .update({gameRefArr: [...gameRefArr, gameRef]});
}

/** Create a new gameRef. */
export async function getGameRef(user, role) {
  // Create row array.
  const rowArr = [];
  rowArr.length = GameConfig.rowCount;
  rowArr.fill({
    clueArr: Array.from(
      {length: GameConfig.guessSpotCount},
      v => Color.GREY_200
    ),
    guessArr: Array.from(
      {length: GameConfig.guessSpotCount},
      v => Color.GREY_200
    ),
  });

  // Create a round document for the first game.
  const roundOne = {
    codeArr: Array.from(
      {length: GameConfig.guessSpotCount},
      v => Color.GREY_200
    ),
    codebreaker: role === 'codebreaker' ? user : '',
    codemaker: role === 'codemaker' ? user : '',
    rowArr,
  };

  // Create a game document.
  const game = {
    currentRound: 0,
    isFinished: false,
    playerOne: user,
    playerTwo: '',
    roundArr: [roundOne],
    chatContent: [
      {
        isNarration: true,
        message: Narration.start,
        timeStamp: new Date(),
      },
    ],
  };

  return await firestore.collection('games').add(game);
}
