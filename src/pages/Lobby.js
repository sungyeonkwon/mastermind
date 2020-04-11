import React, {useState} from 'react';
import {Link} from 'react-router-dom';

import {withUser} from '../providers/UserProvider';
import {withGame} from '../providers/GameProvider';

export default function Lobby({user, startGame, setGameRef, history}) {
  const [role, setRole] = useState('codemaker');

  const handleRoleChange = event => {
    setRole(event.target.value);
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
          room number: <span>23423</span>
        </p>
      </div>
      <div className="join">
        Enter the existing game room id
        <span>Error: Room is already full.</span>
        <p>
          room number: <input />
        </p>
      </div>
      <Link to="/game" onClick={() => startGame(user, setGameRef, history)}>
        Enter the room
      </Link>
      <h1 className="logo">Mastermind</h1>
    </div>
  );
}

export const LobbyWithGame = withGame(withUser(Lobby));
