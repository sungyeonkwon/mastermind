import React from 'react';
import styled from 'styled-components';

import {signOut} from '../services/firebase';

const SectionStyle = styled.section`
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  display: flex;
  height: 30px;
  justify-content: center;
  padding: 10px;
  position: fixed;
  right: 0;
  top: 0;

  p {
    padding: 0 10px;
  }

  button {
    background: black;
    color: white;
    border: none;
    cursor: pointer;
  }
`;

export default function CurrentUser({displayName}) {
  return (
    <SectionStyle>
      <p>{displayName}</p>
      <button onClick={signOut}>Sign Out</button>
    </SectionStyle>
  );
}
