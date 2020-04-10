import React, {createContext, useEffect, useState} from 'react';

import {firestore} from '../services/firebase';
import {Narration} from '../shared/constants';
import {getDisplayName} from '../shared/utils';

export const GameContext = createContext();

export function GameProvider({children}) {
  const [gameRef, setGameRef] = useState({id: null});
  const [chatRef, setChatRef] = useState('');

  useEffect(() => {
    if (gameRef.id) {
      firestore
        .doc(`games/${gameRef.id}`)
        .get()
        .then(val => {
          const gameDoc = val.data();
          setChatRef(gameDoc.chatRef);
        });
    }
  }, [gameRef]);

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

async function startGame(user, setGameRef) {
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

  // Save the gameRef object to the game provider state.
  setGameRef(gameRef);
}
