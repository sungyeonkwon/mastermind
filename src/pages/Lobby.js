import React from 'react';

export default function Lobby() {
  return (
    <div className="lobby">
      <div className="start">
        <label for="role">I will first be a </label>
        <select name="role" id="role">
          <option value="">--Please choose an option--</option>
          <option value="codemaker">codemaker</option>
          <option value="codebreaker">codebreaker</option>
        </select>
        Starting game...
        <p>
          room number: <span>23423</span>
        </p>
        <button>Go enter the room</button>
      </div>

      <div className="join">
        Enter the existing game room id
        <span>Error: Room is already full.</span>
        <p>
          room number: <input />
        </p>
        <button>Go enter the room</button>
      </div>

      <h1 className="logo">Mastermind</h1>
    </div>
  );
}
