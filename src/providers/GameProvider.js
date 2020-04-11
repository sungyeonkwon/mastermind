import React, {createContext, useEffect, useState, useContext} from 'react';

import {firestore} from '../services/firebase';
import {Narration} from '../shared/constants';
import {getDisplayName} from '../shared/utils';
import {UserContext} from './UserProvider';

export const GameContext = createContext();

export function GameProvider({children}) {
  const [gameRef, setGameRef] = useState({id: null});
  const [chatRef, setChatRef] = useState('');
  const user = useContext(UserContext);

  useEffect(() => {
    if (gameRef.id) {
      firestore
        .doc(`games/${gameRef.id}`)
        .get()
        .then(val => {
          const gameDoc = val.data();
          setChatRef(gameDoc.chatRef);
        });
    } else {
      // If there's no gameRef, get it from user doc.
      firestore
        .doc(`users/${user.uid}`)
        .get()
        .then(async userRef => {
          const userData = await userRef.data();
          if (userData) {
            const gameRefArr = await userData.gameRefArr;
            const lastGameRef = gameRefArr[gameRefArr.length - 1];
            setGameRef(lastGameRef);
          }
        });
    }
  }, [gameRef, user.uid]);

  return (
    <GameContext.Provider value={{gameRef, setGameRef, chatRef}}>
      {children}
    </GameContext.Provider>
  );
}

export const withGame = Component => {
  const WrappedComponent = props => (
    <GameContext.Consumer>
      {({gameRef, setGameRef, chatRef}) => (
        <Component
          startGame={startGame}
          setGameRef={setGameRef}
          chatRef={chatRef}
          gameRef={gameRef}
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

async function startGame(user, setGameRef, history) {
  // Create a chat document, an array starting with a narration.
  const chat = {
    chatContent: [
      {
        isNarration: true,
        message: Narration.startGame,
        timeStamp: new Date(),
      },
    ],
  };
  const chatRef = await firestore.collection('chats').add(chat);

  // Create a round document for the first game.
  const roundOne = {
    codemaker: user,
    codebreaker: '',
    rowRefArr: [],
  };
  const roundOneRef = await firestore.collection('rounds').add(roundOne);

  // Create a game document.
  const game = {
    playerOne: user,
    playerTwo: '',
    chatRef,
    roundRefArr: [roundOneRef],
  };
  const gameRef = await firestore.collection('games').add(game);

  // Store gameRef to gameRef array on the user document.
  const userRef = await firestore.doc(`users/${user.uid}`).get();
  const gameRefArr = await userRef.data().gameRefArr;
  await firestore
    .doc(`users/${user.uid}`)
    .update({gameRefArr: [...gameRefArr, gameRef]});

  // Push room query string to url.
  const url = setParams({room: gameRef.id});
  gameRef.id && url && history.push(`?${url}`);

  // Save the gameRef object to the game provider state.
  setGameRef(gameRef);
}

function setParams({room = ''}) {
  const searchParams = new URLSearchParams();
  searchParams.set('room', room);
  return searchParams.toString();
}
