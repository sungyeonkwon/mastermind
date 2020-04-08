import React, {Component} from 'react';
import {useEffect} from 'react';
import {useState} from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';

import {auth} from './services/firebase';
import Authentication from './components/Authentification';
import {firestore} from './services/firebase';
import './App.css';
import {Routes} from './routes/routes';

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
          {Routes.map(({path, exact, component: Component, ...rest}) => (
            <Route
              key={path}
              exact={exact}
              path={path}
              render={props => <Component {...props} {...rest} />}></Route>
          ))}
        </Switch>
      </Router>
    </div>
  );
}

export default App;
