import React from 'react';

import {AuthentificationWithUser} from './Authentification';
import {withGame} from '../providers/GameProvider';
import {getRoundDoc} from '../shared/utils';

export default function Header({gameDoc}) {
  let round;
  try {
    round = getRoundDoc(gameDoc);
  } catch {}

  return (
    <header>
      <div>
        {round &&
          `[Game Round ${gameDoc.currentRound + 1}] [codemaker: ${
            round.codemaker.displayName
          }]
        [codebreaker: ${round.codebreaker.displayName}]`}
      </div>
      <AuthentificationWithUser />
    </header>
  );
}

export const HeaderWithGame = withGame(Header);
