import React from 'react';

import Board from '../components/Board';
import Control from '../components/Control';
import {withUser} from '../providers/UserProvider';

// TODO: Game does not need to consume user. Remove the wrapper.
export default function Game() {
  return (
    <div className="game">
      <Board />
      <Control />
    </div>
  );
}

export const GameWithUser = withUser(Game);
