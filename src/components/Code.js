import React from 'react';

import {SpotWithGame} from './Spot';
import {withGame} from '../providers/GameProvider';
import {withUser} from '../providers/UserProvider';
import {isCodebreaker} from '../shared/utils';

export default function Code({codeArr, gameDoc, user}) {
  if (!gameDoc || !user) return <></>;

  const hideCode = isCodebreaker(gameDoc, user);

  return (
    <div className="answer">
      {codeArr &&
        codeArr.length &&
        codeArr.map((val, columnIndex) => (
          <SpotWithGame
            spotType="code"
            color={val}
            key={columnIndex}
            rowIndex="12"
            columnIndex={columnIndex}
            shouldHide={hideCode}
          />
        ))}
    </div>
  );
}

export const CodeWithGame = withGame(withUser(Code));
