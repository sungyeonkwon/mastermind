import React from 'react';
import {signOut} from '../services/firebase';

export default function CurrentUser({displayName, email, createdAt}) {
  return (
    <section>
      <div>
        <h2>{displayName}</h2>
        <p>{email}</p>
        <p>{createdAt}</p>
      </div>
      <div>
        <button onClick={signOut}>Sign Out</button>
      </div>
    </section>
  );
}
