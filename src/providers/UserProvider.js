import React, {createContext, useEffect, useState} from 'react';

import {auth, createUserDocument} from '../services/firebase';

export const UserContext = createContext();

export function UserProvider({children}) {
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

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

export const withUser = Component => {
  const WrappedComponent = props => (
    <UserContext.Consumer>
      {user => <Component user={user} {...props} />}
    </UserContext.Consumer>
  );
  WrappedComponent.displayName = `WithUser(${getDisplayName(
    WrappedComponent
  )})`;

  return WrappedComponent;
};

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}
