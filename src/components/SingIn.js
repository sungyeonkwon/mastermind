import React from 'react';
import styled from 'styled-components';

import {signInWithGoogle} from '../services/firebase';

const ButtonStyle = styled.button`
  align-items: center;
  background: rgba(0, 0, 0, .5);
  color: white;
  display: flex;
  height: 30px;
  justify-content: center;
  outline: none;
  position: fixed;
  right: 0;
  top: 0;
`;

export default function SignIn() {
  return <ButtonStyle onClick={signInWithGoogle}>Sign In With Google</ButtonStyle>;
}
