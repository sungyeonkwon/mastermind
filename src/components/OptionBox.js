import React from 'react';
import styled from 'styled-components';

import {COLOR_OPTIONS, CLUE_OPTIONS} from '../shared/config';

const Options = styled.div`
  border: 1px solid black;
  padding: 10px;
`;

const ColorPeg = styled.div`
  background: ${props => props.color};
  border-radius: 50%;
  border: 1px solid black;
  display: inline-block;
  height: 50px;
  margin: 10px;
  width: 50px;
`;

export default function OptionBox() {
  return (
    <div className="option-box">
      <Options>
        Guess options:
        {COLOR_OPTIONS.map((color, index) => (
          <ColorPeg key={index} color={color}>
            {color}
          </ColorPeg>
        ))}
      </Options>
      <Options>
        Clue options:
        {CLUE_OPTIONS.map((color, index) => (
          <ColorPeg key={index} color={color}>
            {color}
          </ColorPeg>
        ))}
      </Options>
    </div>
  );
}
