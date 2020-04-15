import React, {createContext, useEffect, useState, useContext} from 'react';

import {firestore} from '../services/firebase';
import {Narration} from '../shared/constants';
import {getDisplayName, setRoomParam, getRoomParam} from '../shared/utils';
import {UserContext} from './UserProvider';
import {GameConfig} from '../shared/config';

export const GameContext = createContext();

export function GameProvider({children}) {
  const [optionType, setOptionType] = useState('');
  const [optionValue, setOptionValue] = useState('');
  const [gameRef, setGameRef] = useState({id: null});
  const [gameDoc, setGameDoc] = useState({});
  const user = useContext(UserContext);

  useEffect(() => {
    if (gameRef && gameRef.id) {
      // TODO: unsubscribe.
      firestore.doc(`games/${gameRef.id}`).onSnapshot(snapshot => {
        const gameDoc = snapshot.data();
        // TODO: On the lobby case.
        setGameDoc(gameDoc);
      });
    } else {
      // If there's no gameRef, get it from url params.
      // TODO: validation check with user id.
      const gameIdFromUrl = getRoomParam();
      // TODO: unsubscribe.
      firestore.doc(`games/${gameIdFromUrl}`).onSnapshot(snapshot => {
        setGameRef(snapshot.ref);
        setGameDoc(snapshot.data());
      });
    }
  }, [gameRef, user.uid]);

  return (
    <GameContext.Provider
      value={{
        gameDoc,
        gameRef,
        optionType,
        optionValue,
        setGameRef,
        setGameDoc,
        setOptionType,
        setOptionValue,
        updateGame,
      }}>
      {children}
    </GameContext.Provider>
  );
}

export const withGame = Component => {
  const WrappedComponent = props => (
    <GameContext.Consumer>
      {({
        gameDoc,
        gameRef,
        optionType,
        optionValue,
        setGameDoc,
        setGameRef,
        setOptionType,
        setOptionValue,
        setRoundRef,
        updateGame,
      }) => (
        <Component
          gameDoc={gameDoc}
          gameRef={gameRef}
          joinGame={joinGame}
          optionType={optionType}
          optionValue={optionValue}
          setGameDoc={setGameDoc}
          setGameRef={setGameRef}
          setOptionType={setOptionType}
          setOptionValue={setOptionValue}
          setRoundRef={setRoundRef}
          startGame={startGame}
          updateGame={updateGame}
          {...props}
        />
      )}
    </GameContext.Consumer>
  );
  WrappedComponent.displayName = `WithGame(${getDisplayName(
    WrappedComponent
  )})`;

  return WrappedComponent;
};

async function updateGame(
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
  if (type === 'guess' && spotType === 'guess') {
    newRowArr[rowIndex].guessArr[columnIndex] = value;
  } else if (type === 'clue' && spotType === 'clue') {
    newRowArr[rowIndex].clueArr[columnIndex] = value;
  }
  roundData.rowArr = newRowArr;
  gameRef.update({
    roundArr: [...gameData.roundArr],
  });
}

async function joinGame(_event, roomId, user, setGameRef, setGameDoc) {
  // TODO: Ensure the user is not the same as player one.
  if (!user) return;

  const gameRef = await firestore.doc(`games/${roomId}`);
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

  // Update gameRef.
  setGameRef(gameRef);
  setGameDoc(gameDoc);
}

async function startGame(user, role, setGameRef, history, setGameDoc) {
  // Create row array.
  const rowArr = [];
  rowArr.length = GameConfig.rowCount;
  rowArr.fill({
    clueArr: Array.from({length: GameConfig.guessSpotCount}, v => 'white'),
    guessArr: Array.from({length: GameConfig.guessSpotCount}, v => 'white'),
  });

  // Create a round document for the first game.
  const roundOne = {
    codemaker: role === 'codemaker' ? user : '',
    codebreaker: role === 'codebreaker' ? user : '',
    codeArr: [],
    rowArr,
  };

  // Create a game document.
  const game = {
    playerOne: user,
    playerTwo: '',
    currentRound: 0,
    roundArr: [roundOne],
    isFinished: false,
    chatContent: [
      {
        isNarration: true,
        message: Narration.startGame,
        timeStamp: new Date(),
        // TODO: Move the first line of narration to here.
      },
    ],
  };
  const gameRef = await firestore.collection('games').add(game);

  // Store gameRef to gameRef array on the user document.
  const userRef = await firestore.doc(`users/${user.uid}`).get();
  const gameRefArr = await userRef.data().gameRefArr;
  await firestore
    .doc(`users/${user.uid}`)
    .update({gameRefArr: [...gameRefArr, gameRef]});

  // Push room query string to url.
  const url = setRoomParam({room: gameRef.id});
  gameRef.id && url && history.push(`?${url}`);

  // Save the gameRef object to the game provider state.
  const gameDoc = await gameRef.get();
  setGameRef(gameRef);
  setGameDoc(gameDoc);
}
