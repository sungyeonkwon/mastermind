import React from 'react';
import styled from 'styled-components';

import {signOut} from '../services/firebase';

const SectionStyle = styled.section`
  background: rgba(0, 0, 0, .5);
  color: white;
  display: flex;
  right: 0;
  position: fixed;
  top: 0;
  height: 30px;
  align-items: center;
  justify-content: center;
  padding: 10px;

  p {
    padding: 0 10px;
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
