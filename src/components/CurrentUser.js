import React from 'react';

import {signOut} from '../services/firebase';

export default function CurrentUser({displayName}) {
  return (
    <div className="current-user">
      <p>{displayName}</p>
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
}
