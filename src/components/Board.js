import React from 'react';

import {GameConfig} from '../shared/config';
import {withGame} from '../providers/GameProvider';
import {withUser} from '../providers/UserProvider';

function Row({rowIndex, gameDoc, updateGame}) {
  let round;
  try {
    round = gameDoc.roundArr[gameDoc.currentRound];
  } catch (error) {
    // console.log(error);
  }
  return (
    <div className="row">
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
    <div className="code">
      {[...Array(GameConfig.guessSpotCount).keys()].map((_val, columnIndex) => (
        <SpotWithGame
          spotType="guess"
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
  updateGame,
  gameRef,
  optionType,
  optionValue,
}) {
  const borderColor = spotType === 'guess' ? 'red' : 'black';

  const handleDragOver = event => {
    event.preventDefault();
  };

  const handleDrop = event => {
    event.preventDefault();
    const row = event.target.dataset.rowIndex;
    const col = event.target.dataset.columnIndex;
    updateGame(gameRef, optionType, optionValue, row, col, spotType);
  };

  const handleDragEnter = event => {
    event.target.style.border = `3px solid ${borderColor}`;
  };

  const handleDragLeave = event => {
    event.target.style.border = `1px solid ${borderColor}`;
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
      data-row-index={rowIndex}>
      {rowIndex}, {columnIndex}
    </p>
  );
}

export default function Board({gameDoc, user}) {
  let round, isCodebreaker;
  try {
    round = gameDoc.roundArr[gameDoc.currentRound];
    isCodebreaker =
      gameDoc.roundArr[gameDoc.currentRound].codebreaker.uid === user.uid;
  } catch (error) {
    // console.log(error);
  }

  return (
    <div className="board">
      <div style={{order: isCodebreaker && 1}}>
        {round &&
          round.rowArr.map((_val, rowIndex) => (
            <RowWithGame key={rowIndex} rowIndex={rowIndex} />
          ))}
      </div>
      <Code />
    </div>
  );
}

export const RowWithGame = withGame(Row);
export const SpotWithGame = withGame(Spot);
export const BoardWithGame = withGame(withUser(Board));
