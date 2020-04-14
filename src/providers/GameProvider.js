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
  const [chatRef, setChatRef] = useState('');
  const user = useContext(UserContext);

  useEffect(() => {
    if (gameRef && gameRef.id) {
      // TODO: unsubscribe.
      firestore.doc(`games/${gameRef.id}`).onSnapshot(snapshot => {
        const gameDoc = snapshot.data();
        // TODO: On the lobby case.
        gameDoc && setChatRef(gameDoc.chatRef);
      });
    } else {
      // If there's no gameRef, get it from url params.
      // TODO: validation check with user id.
      const gameIdFromUrl = getRoomParam();
      // TODO: unsubscribe.
      firestore.doc(`games/${gameIdFromUrl}`).onSnapshot(snapshot => {
        setGameRef(snapshot);
      });
    }
  }, [gameRef, user.uid]);

  return (
    <GameContext.Provider
      value={{
        gameRef,
        setGameRef,
        chatRef,
        setChatRef,
        optionType,
        setOptionType,
        optionValue,
        setOptionValue,
      }}>
      {children}
    </GameContext.Provider>
  );
}

export const withGame = Component => {
  const WrappedComponent = props => (
    <GameContext.Consumer>
      {({
        gameRef,
        setGameRef,
        chatRef,
        setChatRef,
        optionType,
        setOptionType,
        optionValue,
        setOptionValue,
      }) => (
        <Component
          chatRef={chatRef}
          gameRef={gameRef}
          joinGame={joinGame}
          optionType={optionType}
          optionValue={optionValue}
          setChatRef={setChatRef}
          setGameRef={setGameRef}
          setOptionType={setOptionType}
          setOptionValue={setOptionValue}
          startGame={startGame}
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

async function joinGame(_event, roomId, user, setGameRef, setChatRef) {
  // TODO: Ensure the user is not the same as player one.
  // Update gameRef's player Two.
  if (!user) return;

  const gameRef = await firestore.doc(`games/${roomId}`);
  await gameRef.update({
    playerTwo: user,
  });

  // Push the gameRef to the user game array.
  await firestore.doc(`users/${user.uid}`).update({gameRefArr: [gameRef]});

  // Update gameRef and chatRef.
  const gameDoc = await gameRef.get();
  const chatRef = gameDoc.data().chatRef;
  setGameRef(gameRef);
  setChatRef(chatRef);
}

async function startGame(user, setGameRef, history) {
  // Create a chat document, an array starting with a narration.
  const chat = {
    chatContent: [
      {
        isNarration: true,
        message: Narration.startGame,
        timeStamp: new Date(),
        // TODO: Move the first line of narration to here.
      },
    ],
  };
  const chatRef = await firestore.collection('chats').add(chat);

  // Create row array.
  const rowArr = [];
  rowArr.length = GameConfig.rowCount;
  rowArr.fill({clueArr: [], guessArr: []});
  const rowArrRef = await firestore.collection('rows').add({rowArr});

  // Create a round document for the first game.
  const roundOne = {
    codemaker: user,
    codebreaker: '',
    rowArrRef,
  };
  const roundOneRef = await firestore.collection('rounds').add(roundOne);

  // Create a game document.
  const game = {
    playerOne: user,
    playerTwo: '',
    chatRef,
    roundRefArr: [roundOneRef],
    isFinished: false,
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
  setGameRef(gameRef);
}
