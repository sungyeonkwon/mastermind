import React from 'react';
import styled from 'styled-components';

import {GUESS_OPTIONS, CLUE_OPTIONS} from '../shared/config';
import {withGame} from '../providers/GameProvider';

const GuessPeg = styled.div`
  background: ${props => props.color};
  border-radius: 50%;
  display: inline-block;
  height: 70px;
  margin: 10px;
  width: 70px;
`;

const CluePeg = styled.div`
  background: ${props => props.color};
  border-radius: 50%;
  display: inline-block;
  height: 40px;
  margin: 10px;
  width: 40px;
`;

export default function OptionBox({setOptionType, setOptionValue}) {
  // TODO: Use throttle.
  const handleDrag = event => {
    setOptionType(event.target.dataset.type);
    setOptionValue(event.target.dataset.value);
  };

  return (
    <div className="option-box">
      <div className="group">
        <p className="label">Guess Pegs</p>
        <div>
          {GUESS_OPTIONS.map((color, index) => (
            <GuessPeg
              className="peg"
              draggable
              key={index}
              color={color}
              data-type="guess"
              data-value={color}
              onDrag={handleDrag}></GuessPeg>
          ))}
        </div>
      </div>
      <div className="group">
        <p className="label">Clue Pegs</p>
        <div>
          {CLUE_OPTIONS.map((color, index) => (
            <CluePeg
              className="peg"
              draggable
              key={index}
              color={color}
              data-type="clue"
              data-value={color}
              onDrag={handleDrag}></CluePeg>
          ))}
        </div>
      </div>
    </div>
  );
}

export const OptionBoxWithGame = withGame(OptionBox);
