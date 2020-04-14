import React from 'react';

import {BoardWithGame} from '../components/Board';
import Control from '../components/Control';

export default function Game() {
  return (
    <div className="game">
      <BoardWithGame />
      <Control />
    </div>
  );
}
