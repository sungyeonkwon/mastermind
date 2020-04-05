import React from 'react';
import {signInWithGoogle} from '../services/firebase';

export default function SignIn() {
  return <button onClick={signInWithGoogle}>Sign In With Google</button>;
}
