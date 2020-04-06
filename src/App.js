import React from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';

import {auth} from './services/firebase';
import Authentication from './components/Authentification';
import {useEffect} from 'react';
import {useState} from 'react';
import Game from './pages/Game';
import Lobby from './pages/Lobby';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribeFromAuth = async () =>
      await auth.onAuthStateChanged(user => {
        setUser(user);
      });
    unsubscribeFromAuth();
  });

  return (
    <div>
      <Authentication user={user} />
      <Router>
        <Switch>
          <Route path="/lobby">
            <Lobby />
          </Route>
          <Route path="/game">
            <Game />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
