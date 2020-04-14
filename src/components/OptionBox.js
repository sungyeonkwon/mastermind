import React from 'react';
import styled from 'styled-components';

import {GUESS_OPTIONS, CLUE_OPTIONS} from '../shared/config';
import {withGame} from '../providers/GameProvider';

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

export default function OptionBox({setOptionType, setOptionValue}) {
  // TODO: Use throttle.
  const handleDrag = event => {
    setOptionType(event.target.dataset.type);
    setOptionValue(event.target.dataset.value);
  };

  return (
    <div className="option-box">
      <Options>
        Guess options:
        {GUESS_OPTIONS.map((color, index) => (
          <ColorPeg
            draggable
            key={index}
            color={color}
            data-type="guess"
            data-value={color}
            onDrag={handleDrag}></ColorPeg>
        ))}
      </Options>
      <Options>
        Clue options:
        {CLUE_OPTIONS.map((color, index) => (
          <ColorPeg
            draggable
            key={index}
            color={color}
            data-type="clue"
            data-value={color}
            onDrag={handleDrag}></ColorPeg>
        ))}
      </Options>
    </div>
  );
}

export const OptionBoxWithGame = withGame(OptionBox);
