import React, {useState, useEffect} from 'react';

import {BoardWithGame} from '../components/Board';
import Control from '../components/Control';
import Loading from '../components/Loading';
import {withGame} from '../providers/GameProvider';

const MIN_LOADING_DELAY = 1500;

export default function Game({gameDoc}) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (gameDoc.chatContent) {
      setTimeout(() => setLoading(false), MIN_LOADING_DELAY);
    }
  }, [gameDoc]);

  const hide = !loading && 'hide';
  return (
    <div className="game">
      <Loading hide={hide} />
      <BoardWithGame />
      <Control />
    </div>
  );
}

export const GameWithGame = withGame(Game);
