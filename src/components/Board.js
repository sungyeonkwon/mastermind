import React from 'react';

import {withGame} from '../providers/GameProvider';
import {withUser} from '../providers/UserProvider';
import {isCodebreaker, getRoundDoc} from '../shared/utils';
import {RowWithGame} from './Row';
import Code from './Code';

export default function Board({gameDoc, user}) {
  let round, codebreaker, codeArr;

  try {
    round = getRoundDoc(gameDoc);
    codeArr = round.codeArr;
    codebreaker = isCodebreaker(gameDoc, user);
  } catch (error) {}

  return (
    <div className="board">
      <div style={{order: codebreaker && 1}}>
        {round &&
          round.rowArr.map((_val, rowIndex) => (
            <RowWithGame key={rowIndex} rowIndex={rowIndex} />
          ))}
      </div>
      <Code codeArr={codeArr} />
    </div>
  );
}

export const BoardWithGame = withGame(withUser(Board));
