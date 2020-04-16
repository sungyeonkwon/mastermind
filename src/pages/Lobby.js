import React, {useState} from 'react';

import {withUser} from '../providers/UserProvider';
import {withGame} from '../providers/GameProvider';
import {firestore} from '../services/firebase';
import {startGame, joinGame} from '../services/game';

export default function Lobby({
  user,
  setGameRef,
  setGameDoc,
  setRoundRef,
  history,
}) {
  const [role, setRole] = useState('');
  const [roomId, setRoomId] = useState('');
  const [errorFull, setErrorFull] = useState(false);
  const [errorInvalid, setErrorInvalid] = useState(false);

  const handleRoleChange = event => {
    setRole(event.target.value);
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
          setRoomId(roomId);
        });
    } catch {}
  };

  return (
    <div className="lobby">
      <h1 className="logo">Mastermind</h1>

      <div className="container">
        <div className="start">
          <button>Start a new game.</button>I will first be
          <div className="option">
            <input
              checked={role === 'codemaker'}
              onChange={handleRoleChange}
              type="radio"
              id="codemaker"
              value="codemaker"
              name="role"
            />
            <label htmlFor="codemaker">codemaker</label>
          </div>
          <div className="option">
            <input
              checked={role === 'codebreaker'}
              onChange={handleRoleChange}
              type="radio"
              id="codebreaker"
              value="codebreaker"
              name="role"
            />
            <label htmlFor="codebreaker">codebreaker</label>
          </div>
          <p>
            room ID: <span>23423</span>
          </p>
          <p> Copy this ID and send it to your friend to play with.</p>
          <button
            onClick={() =>
              startGame(
                user,
                role,
                setGameRef,
                history,
                setGameDoc,
                setRoundRef
              )
            }>
            Enter the room
          </button>
        </div>
        <div className="join">
          <span className={`error full ${errorFull && 'show'}`}>
            Error: Room is already full.
          </span>
          <span className={`error invalid ${errorInvalid && 'show'}`}>
            Error: Room id is invalid.
          </span>
          <p>
            Join a game with ID:
            <input
              type="text"
              value={roomId}
              onChange={handleRoomInputChange}
            />
          </p>
          {!errorFull && !errorInvalid && roomId && (
            <button
              className="enter"
              onClick={_event =>
                joinGame(_event, roomId, user, setGameRef, setGameDoc, history)
              }>
              Enter the room
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export const LobbyWithGame = withGame(withUser(Lobby));
