import React from 'react';

import CurrentUser from './CurrentUser';
import SignIn from './SingIn';
import {withUser} from '../providers/UserProvider';

export default function Authentication({user}) {
  return user.uid ? <CurrentUser {...user} /> : <SignIn />;
}

export const AuthenticationWithUser = withUser(Authentication);
