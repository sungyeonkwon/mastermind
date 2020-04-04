import firebase from 'firebase/app';
import 'firebase/firestore';

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
export default firebase;
