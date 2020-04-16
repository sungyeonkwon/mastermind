import React from 'react';

import {GameConfig} from '../shared/config';
import {withGame} from '../providers/GameProvider';
import {withUser} from '../providers/UserProvider';
import {isCodebreaker} from '../shared/utils';
import {updateGame} from '../services/game';

function Row({rowIndex, gameDoc, user}) {
  let round, index;
  try {
    round = gameDoc.roundArr[gameDoc.currentRound];
    index = isCodebreaker(gameDoc, user)
      ? GameConfig.rowCount - rowIndex
      : rowIndex + 1;
  } catch (error) {
    // console.log(error);
  }

  return (
    <div className="row">
      <span class="index label">{index}</span>
      {round &&
        round.rowArr[rowIndex].guessArr.map((val, columnIndex) => (
          <SpotWithGame
            spotType="guess"
            color={val}
            key={columnIndex}
            columnIndex={columnIndex}
            rowIndex={rowIndex}
          />
        ))}

      {round &&
        round.rowArr[rowIndex].clueArr.map((val, columnIndex) => (
          <SpotWithGame
            spotType="clue"
            color={val}
            key={columnIndex}
            columnIndex={columnIndex}
            rowIndex={rowIndex}
          />
        ))}
    </div>
  );
}

function Code() {
  return (
    <div className="answer">
      {[...Array(GameConfig.guessSpotCount).keys()].map((_val, columnIndex) => (
        <SpotWithGame
          spotType="code"
          key={columnIndex}
          rowIndex="12"
          columnIndex={columnIndex}
        />
      ))}
    </div>
  );
}

function Spot({
  columnIndex,
  rowIndex,
  color,
  spotType,
  gameRef,
  optionType,
  optionValue,
}) {
  const handleDragOver = event => {
    event.preventDefault();
  };

  const handleDrop = event => {
    event.preventDefault();
    event.target.style.transform = 'scale(1)';
    const row = event.target.dataset.rowIndex;
    const col = event.target.dataset.columnIndex;
    updateGame(gameRef, optionType, optionValue, row, col, spotType);
  };

  const handleDragEnter = event => {
    event.target.style.transform = 'scale(1.3)';
  };

  const handleDragLeave = event => {
    event.target.style.transform = 'scale(1)';
  };

  return (
    <p
      onDrop={event => handleDrop(event)}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      className={spotType}
      style={{backgroundColor: color}}
      data-column-index={columnIndex}
      data-row-index={rowIndex}></p>
  );
}

export default function Board({gameDoc, user}) {
  let round, codebreaker;
  try {
    round = gameDoc.roundArr[gameDoc.currentRound];
    codebreaker = isCodebreaker(gameDoc, user);
  } catch (error) {
    // console.log(error);
  }

  return (
    <div className="board">
      <div style={{order: codebreaker && 1}}>
        {round &&
          round.rowArr.map((_val, rowIndex) => (
            <RowWithGame key={rowIndex} rowIndex={rowIndex} />
          ))}
      </div>
      <Code />
    </div>
  );
}

export const RowWithGame = withGame(withUser(Row));
export const SpotWithGame = withGame(Spot);
export const BoardWithGame = withGame(withUser(Board));
