import React, {createContext, useEffect, useState, useContext} from 'react';

import {firestore} from '../services/firebase';
import {getDisplayName, getRoomParam} from '../shared/utils';
import {UserContext} from './UserProvider';

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
        setGameDoc,
        setGameRef,
        setOptionType,
        setOptionValue,
      }}>
      {children}
    </GameContext.Provider>
  );
}

export function withGame(Component) {
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
      }) => (
        <Component
          gameDoc={gameDoc}
          gameRef={gameRef}
          optionType={optionType}
          optionValue={optionValue}
          setGameDoc={setGameDoc}
          setGameRef={setGameRef}
          setOptionType={setOptionType}
          setOptionValue={setOptionValue}
          setRoundRef={setRoundRef}
          {...props}
        />
      )}
    </GameContext.Consumer>
  );
  WrappedComponent.displayName = `WithGame(${getDisplayName(
    WrappedComponent
  )})`;

  return WrappedComponent;
}
