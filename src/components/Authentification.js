import React from 'react';

import CurrentUser from './CurrentUser';
import SignIn from './SingIn';
import {withUser} from '../providers/UserProvider';

export default function Authentification({user}) {
  return user.uid ? <CurrentUser {...user} /> : <SignIn />;
}

export const AuthentificationWithUser = withUser(Authentification);
