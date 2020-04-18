import React from 'react';

import {signInWithGoogle} from '../services/firebase';

export default function SignIn() {
  return (
    <button className="sign-in" onClick={signInWithGoogle}>
      Sign In With Google
    </button>
  );
}
