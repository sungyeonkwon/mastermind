import React from 'react';

import {AuthentificationWithUser} from './Authentification';

export default function Header() {
  return (
    <header>
      <div>Game Round 1: codemaker: [Sung] codebreaker: [Sung]</div>
      <AuthentificationWithUser />
    </header>
  );
}
