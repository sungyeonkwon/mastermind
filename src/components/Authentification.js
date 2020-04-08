import React, {useContext} from 'react';

import CurrentUser from './CurrentUser';
import SignIn from './SingIn';

export default function Authentication({user}) {
  return user.uid ? <CurrentUser {...user} /> : <SignIn />;
}
