import React from 'react';
import {useEffect} from 'react';
import {useState} from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';

import {auth, createUserDocument} from './services/firebase';
import Authentication from './components/Authentification';
import './App.css';
import {Routes} from './routes/routes';

function App() {
  const [user, setUser] = useState({uid: null});

  useEffect(() => {
    const unsubscribeFromAuth = async () =>
      await auth.onAuthStateChanged(async user => {
        if (user) {
          const userDocument = await createUserDocument(user);
          userDocument.createdAt = null;
          setUser(userDocument);
        } else {
          setUser({uid: null});
        }
      });
    unsubscribeFromAuth();
    return () => unsubscribeFromAuth();
  }, [user.uid, setUser]);

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
              render={props => (
                <Component {...props} {...rest} user={user} />
              )}></Route>
          ))}
        </Switch>
      </Router>
    </div>
  );
}

export default App;
