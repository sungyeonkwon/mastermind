import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const config = {
  apiKey: 'AIzaSyB54pAFfib07PN8diGsyhVpRZpddagnKT8',
  authDomain: 'mastermind-game-ab342.firebaseapp.com',
  databaseURL: 'https://mastermind-game-ab342.firebaseio.com',
  projectId: 'mastermind-game-ab342',
  storageBucket: 'mastermind-game-ab342.appspot.com',
  messagingSenderId: '911551081564',
  appId: '1:911551081564:web:4892a3bc955ea019f48a99',
  measurementId: 'G-32CVV16JJ4',
};

firebase.initializeApp(config);

export const firestore = firebase.firestore();
export const auth = firebase.auth();

export const provider = new firebase.auth.GoogleAuthProvider();
export const signInWithGoogle = () => auth.signInWithPopup(provider);
export const signOut = () => auth.signOut();

export default firebase;
