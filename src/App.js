import React from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import 'normalize.css';
import './styles/main.scss';

import {HeaderWithGame} from './components/Header';
import ScreenAlert from './components/ScreenAlert';
import {GameProvider} from './providers/GameProvider';
import {Routes} from './routes/routes';
import {UserProvider} from './providers/UserProvider';
import Narrator from './services/narrator';

// Create a narrator instance.
const narrator = new Narrator();

function App() {
  return (
    <div>
      <ScreenAlert />
      <UserProvider>
        <GameProvider narrator={narrator}>
          <HeaderWithGame />
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
        </GameProvider>
      </UserProvider>
    </div>
  );
}

export default App;
