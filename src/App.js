import React from 'react';

import {firestore, auth} from './services/firebase';
import Authentication from './components/Authentification';
import {useEffect} from 'react';
import {useState} from 'react';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribeFromAuth = async () =>
      await auth.onAuthStateChanged(user => {
        console.log('user', user);
        setUser(user);
      });
    unsubscribeFromAuth();
  });
  return (
    <div className="App">
      <h1>Mastermind</h1>
      <Authentication user={user} />
    </div>
  );
}

export default App;
