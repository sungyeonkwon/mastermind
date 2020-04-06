import React from 'react';
import styled from 'styled-components';

import {GameConfig} from '../game/config';

function Row() {
  return (
    <div>
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
    <div>
      {[...Array(GameConfig.guessSpotCount).keys()].map((_val, index) => (
        <Guess key={index} />
      ))}
    </div>
  );
}

function Guess() {
  return <div>guess</div>;
}

function Clue() {
  return <div>clue</div>;
}

export default function Board() {
  return (
    <div>
      {[...Array(GameConfig.rowCount).keys()].map((_val, index) => (
        <Row key={index} />
      ))}
      <Code />
    </div>
  );
}
