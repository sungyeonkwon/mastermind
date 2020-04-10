import React, {useState} from 'react';
import {Link} from 'react-router-dom';

import {firestore} from '../services/firebase';
import {Narration} from '../shared/constants';

export default function Lobby({user}) {
  const [role, setRole] = useState('codemaker');

  const handleRoleChange = event => {
    setRole(event.target.value);
  };

  const startGame = async () => {
    // Create a chat starting with a narration.
    const chat = {
      isNarration: true,
      narration: Narration.startGame,
      timeStamp: new Date(),
    };
    const chatRef = await firestore.collection('chats').add(chat);

    // Create a rounds for the game.
    const roundOne = {
      codemaker: user.uid,
      codebreaker: '',
      rowRefArr: [],
    };
    const roundOneRef = await firestore.collection('rounds').add(roundOne);

    const game = {
      playerOne: user.uid,
      playerTwo: '',
      chatRef,
      roundRefArr: [roundOneRef],
    };
    const gameRef = await firestore.collection('games').add(game);

    console.log('chatRef', chatRef.id);
    console.log('gameRef', gameRef.id);
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
      <Link to="/game" onClick={startGame}>
        Enter the room
      </Link>
      <h1 className="logo">Mastermind</h1>
    </div>
  );
}
