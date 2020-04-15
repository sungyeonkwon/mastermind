import React, {useState} from 'react';
import {Link} from 'react-router-dom';

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
  const [role, setRole] = useState('codemaker');
  const [roomId, setRoomId] = useState('');
  const [errorFull, setErrorFull] = useState(false);
  const [errorInvalid, setErrorInvalid] = useState(false);

  const handleRoleChange = event => {
    setRole(event.target.value);
  };

  const handleRoomInputChange = event => {
    const roomId = event.target.value;
    // TODO: Implement throttle.
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
  };

  return (
    <div className="lobby">
      <div className="start">
        <div>
          I will first be
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
        <div>
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
        Starting game...
        <p>
          room ID: <span>23423</span>
          Copy this ID and send it to your friend to play with.
        </p>
        <Link
          to="/game"
          onClick={() =>
            startGame(user, role, setGameRef, history, setGameDoc, setRoundRef)
          }>
          Enter the room
        </Link>
      </div>
      <div className="join">
        Enter the existing game room id.
        <span className={`error full ${errorFull && 'show'}`}>
          Error: Room is already full.
        </span>
        <span className={`error invalid ${errorInvalid && 'show'}`}>
          Error: Room id is invalid.
        </span>
        <p>
          Room ID:
          <input type="text" value={roomId} onChange={handleRoomInputChange} />
        </p>
        {!errorFull && !errorInvalid && roomId && (
          <Link
            to={`/game?room=${roomId}`}
            onClick={_event =>
              joinGame(
                _event,
                roomId,
                user,
                setGameRef,
                setGameDoc,
                setRoundRef
              )
            }>
            Enter the room
          </Link>
        )}
      </div>
      <h1 className="logo">Mastermind</h1>
    </div>
  );
}

export const LobbyWithGame = withGame(withUser(Lobby));
