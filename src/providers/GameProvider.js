import React, {createContext, useEffect, useState, useContext} from 'react';

import {firestore} from '../services/firebase';
import {getDisplayName, getRoomParam, getRoundDoc} from '../shared/utils';
import {UserContext} from './UserProvider';

export const GameContext = createContext();

export function GameProvider({children, narrator}) {
  const [optionType, setOptionType] = useState('');
  const [optionEl, setOptionEl] = useState('');
  const [optionValue, setOptionValue] = useState('');
  const [gameRef, setGameRef] = useState({id: null});
  const [gameDoc, setGameDoc] = useState(null);
  const user = useContext(UserContext);

  // Restructure the effect.
  useEffect(() => {
    if (gameRef && gameRef.id) {
      const unsubscribe = firestore
        .doc(`games/${gameRef.id}`)
        .onSnapshot(snapshot => {
          const gameDoc = snapshot.data();
          // TODO: On the lobby case.
          setGameDoc(gameDoc);
        });
      return () => unsubscribe();
    } else {
      // If there's no gameRef, get it from url params.
      // TODO: validation check with user id.
      const gameIdFromUrl = getRoomParam();
      const unsubscribe = firestore
        .doc(`games/${gameIdFromUrl}`)
        .onSnapshot(snapshot => {
          setGameRef(snapshot.ref);
          setGameDoc(snapshot.data());
        });
      return () => unsubscribe();
    }
  }, [gameRef, user.uid]);

  return (
    <GameContext.Provider
      value={{
        narrator,
        gameDoc,
        gameRef,
        optionType,
        optionValue,
        optionEl,
        setGameRef,
        setOptionType,
        setOptionValue,
        setOptionEl,
      }}>
      {children}
    </GameContext.Provider>
  );
}

export function withGame(Component) {
  const WrappedComponent = props => (
    <GameContext.Consumer>
      {({
        narrator,
        gameDoc,
        gameRef,
        optionType,
        optionValue,
        optionEl,
        setGameRef,
        setOptionType,
        setOptionValue,
        setOptionEl,
        setRoundRef,
      }) => (
        <Component
          narrator={narrator}
          gameDoc={gameDoc}
          gameRef={gameRef}
          optionType={optionType}
          optionValue={optionValue}
          optionEl={optionEl}
          setGameRef={setGameRef}
          setOptionType={setOptionType}
          setOptionValue={setOptionValue}
          setOptionEl={setOptionEl}
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
