import React from 'react';

import {SpotWithGame} from './Spot';
import {GameConfig} from '../shared/config';
import {withGame} from '../providers/GameProvider';
import {withUser} from '../providers/UserProvider';
import {isCodebreaker, getRoundDoc} from '../shared/utils';

export function Row({rowIndex, user, round, gameDoc}) {
  let guessArr, clueArr, index;

  try {
    round = getRoundDoc(gameDoc);
    guessArr = round.rowArr[rowIndex].guessArr;
    clueArr = round.rowArr[rowIndex].clueArr;
    index = isCodebreaker(gameDoc, user)
      ? GameConfig.rowCount - rowIndex
      : rowIndex + 1;
  } catch (error) {}

  return (
    <div className="row">
      <span className="index label">{index}</span>
      {guessArr &&
        guessArr.length &&
        guessArr.map((val, columnIndex) => (
          <SpotWithGame
            spotType="guess"
            color={val}
            key={columnIndex}
            columnIndex={columnIndex}
            rowIndex={rowIndex}
          />
        ))}

      {clueArr &&
        clueArr.length &&
        clueArr.map((val, columnIndex) => (
          <SpotWithGame
            spotType="clue"
            color={val}
            key={columnIndex}
            columnIndex={columnIndex}
            rowIndex={rowIndex}
          />
        ))}
    </div>
  );
}

export const RowWithGame = withGame(withUser(Row));
