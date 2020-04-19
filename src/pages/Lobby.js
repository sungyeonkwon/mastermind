import React, {useState} from 'react';

import {withUser} from '../providers/UserProvider';
import {withGame} from '../providers/GameProvider';
import {firestore} from '../services/firebase';
import {
  startGame,
  getGameRef,
  setUserGameRef,
  joinGame,
} from '../services/game';
import {copyToClipboard} from '../shared/utils';

export default function Lobby({
  user,
  gameRef,
  setGameRef,
  setRoundRef,
  history,
}) {
  const [errorFull, setErrorFull] = useState(false);
  const [errorInvalid, setErrorInvalid] = useState(false);
  const [role, setRole] = useState('');
  const [startRoomId, setStartRoomId] = useState('');
  const [joinRoomId, setJoinRoomId] = useState('');

  const handleChoice = event => {
    event.target.classList.add('hide');
  };

  const handleRoleChange = async event => {
    setRole(event.target.dataset.role);

    const gameRef = await getGameRef(user, event.target.dataset.role);
    setGameRef(gameRef);
    setUserGameRef(user, gameRef);
    setStartRoomId(gameRef.id);
    document.querySelector('.enter.start').classList.remove('hide');
  };

  const handleCopy = () => {
    copyToClipboard('#roomId');
  };

  const handleRoomInputChange = event => {
    const roomId = event.target.value;
    // TODO: Implement throttle.
    try {
      firestore
        .doc(`games/${roomId}`)
        .get()
        .then(gameRef => {
          if (!gameRef.exists) {
            setErrorInvalid(true);
          } else {
            if (gameRef.data().playerTwo) {
              setErrorFull(true);
            }
          }
          setJoinRoomId(roomId);
        });
    } catch {}
  };

  return (
    <div className="lobby">
      <h1 className="logo">Mastermind</h1>

      <div className="container">
        <div className="start">
          <button onClick={handleChoice} className="choice">
            Start a new game.
          </button>
          {!role && (
            <>
              <button
                className="option"
                onClick={handleRoleChange}
                data-role="codemaker">
                I will first be a codemaker
              </button>
              <button
                className="option"
                onClick={handleRoleChange}
                data-role="codebreaker">
                I will first be a codebreaker
              </button>
            </>
          )}
          {role && (
            <>
              <div>
                <input type="text" id="roomId" value={startRoomId} readOnly />
                <button onClick={handleCopy}>
                  Copy this ID and send it to your friend.
                </button>
              </div>
            </>
          )}
        </div>

        <div className="join">
          <span className={`error full ${errorFull && 'show'}`}>
            Error: Room is already full.
          </span>
          <span className={`error invalid ${errorInvalid && 'show'}`}>
            Error: Room id is invalid.
          </span>
          <p>
            <button onClick={handleChoice} className="choice">
              Join the existing game.
            </button>
            <input
              type="text"
              value={joinRoomId}
              onChange={handleRoomInputChange}
            />
          </p>
        </div>
      </div>

      <button
        className="enter start hide"
        onClick={() => startGame(gameRef, setGameRef, history, setRoundRef)}>
        Enter the room (start)
      </button>
      {!errorFull && !errorInvalid && joinRoomId && (
        <button
          className="enter join"
          onClick={_event =>
            joinGame(_event, joinRoomId, user, setGameRef, history)
          }>
          Enter the room(join)
        </button>
      )}
    </div>
  );
}

export const LobbyWithGame = withGame(withUser(Lobby));
