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
    if (gameRef && gameRef.id) {
      firestore
        .doc(`games/${gameRef.id}`)
        .get()
        .then(gameRef => {
          const gameDoc = gameRef.data();
          setChatRef(gameDoc.chatRef);
        });
    } else {
      // If there's no gameRef, get it from url params.
      // TODO: validation check with user id.
      const gameIdFromUrl = getRoomParam();
      firestore
        .doc(`games/${gameIdFromUrl}`)
        .get()
        .then(async gameRef => setGameRef(gameRef));
    }
  }, [gameRef, user.uid]);

  return (
    <GameContext.Provider value={{gameRef, setGameRef, chatRef, setChatRef}}>
      {children}
    </GameContext.Provider>
  );
}

export const withGame = Component => {
  const WrappedComponent = props => (
    <GameContext.Consumer>
      {({gameRef, setGameRef, chatRef, setChatRef}) => (
        <Component
          startGame={startGame}
          joinGame={joinGame}
          setGameRef={setGameRef}
          setChatRef={setChatRef}
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

function setRoomParam({room = ''}) {
  const searchParams = new URLSearchParams();
  searchParams.set('room', room);
  return searchParams.toString();
}

function getRoomParam() {
  const searchParams = new URLSearchParams(
    document.location.search.substring(1)
  );
  return searchParams.get('room');
}
