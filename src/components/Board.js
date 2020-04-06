import React from 'react';
import styled from 'styled-components';

import {GameConfig} from '../shared/config';

function Row() {
  return (
    <div className="row">
      {[...Array(GameConfig.guessSpotCount).keys()].map((_val, index) => (
        <Guess key={index} />
      ))}

      {[...Array(GameConfig.clueSpotCount).keys()].map((_val, index) => (
        <Clue key={index} />
      ))}
    </div>
  );
}

function Code() {
  return (
    <div className="code">
      {[...Array(GameConfig.guessSpotCount).keys()].map((_val, index) => (
        <Guess key={index} />
      ))}
    </div>
  );
}

function Guess() {
  return <div className="guess">guess</div>;
}

function Clue() {
  return <div className="clue">clue</div>;
}

export default function Board() {
  return (
    <div className="board">
      {[...Array(GameConfig.rowCount).keys()].map((_val, index) => (
        <Row key={index} />
      ))}
      <Code />
    </div>
  );
}
