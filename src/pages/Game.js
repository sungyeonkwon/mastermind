import React from 'react';

import Board from '../components/Board';
import Control from '../components/Control';

export default function Game() {
  return (
    <div className="game">
      <Board />
      <Control />
    </div>
  );
}
