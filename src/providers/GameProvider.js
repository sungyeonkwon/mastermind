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
  const [roundRef, setRoundRef] = useState(null);
  const [roundDoc, setRoundDoc] = useState(null);
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
      });
    }
  }, [gameRef, user.uid]);

  useEffect(() => {
    if (gameRef && gameRef.id && roundRef) {
      // TODO: unsubscribe.
      roundRef.onSnapshot(snapshot => {
        const roundDoc = snapshot.data();
        setRoundDoc(roundDoc);
      });
    }
  }, [gameRef, roundRef, setRoundRef]);

  return (
    <GameContext.Provider
      value={{
        gameDoc,
        gameRef,
        optionType,
        optionValue,
        roundRef,
        roundDoc,
        setGameRef,
        setGameDoc,
        setOptionType,
        setOptionValue,
        setRoundRef,
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
        roundDoc,
        roundRef,
        setChatRef,
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
          roundDoc={roundDoc}
          roundRef={roundRef}
          setChatRef={setChatRef}
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

async function updateGame(roundRef, type, value, rowIndex, columnIndex) {
  const roundData = await (await roundRef.get()).data();
  const newArr = [...roundData.rowArr];
  type === 'guess'
    ? (newArr[rowIndex].guessArr[columnIndex] = value)
    : (newArr[rowIndex].clueArr[columnIndex] = value);
  roundRef.update({rowArr: [...newArr]});
}

async function joinGame(_event, roomId, user, setGameRef, setGameDoc) {
  // TODO: Ensure the user is not the same as player one.
  // Update gameRef's player Two.
  if (!user) return;

  const gameRef = await firestore.doc(`games/${roomId}`);
  await gameRef.update({
    playerTwo: user,
  });

  // Push the gameRef to the user game array.
  await firestore.doc(`users/${user.uid}`).update({gameRefArr: [gameRef]});

  // Update gameRef.
  const gameDoc = await gameRef.get();
  setGameRef(gameRef);
  setGameDoc(gameDoc);
}

async function startGame(user, setGameRef, history, setGameDoc, setRoundRef) {
  // Create row array.
  const rowArr = [];
  rowArr.length = GameConfig.rowCount;
  // TODO: clean the default values.
  rowArr.fill({
    clueArr: ['default', 'default', 'default', 'default', 'default'],
    guessArr: ['default', 'default', 'default', 'default', 'default'],
  });

  // Create a round document for the first game.
  const roundOne = {
    codemaker: user,
    codebreaker: '',
    codeArr: [],
    rowArr,
  };
  const roundOneRef = await firestore.collection('rounds').add(roundOne);
  setRoundRef(roundOneRef);

  // Create a game document.
  const game = {
    playerOne: user,
    playerTwo: '',
    currentRound: 0,
    roundRefArr: [roundOneRef],
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
