import React from 'react';

import {GameConfig} from '../shared/config';
import {withGame} from '../providers/GameProvider';

function Row({
  optionType,
  optionValue,
  rowIndex,
  gameRef,
  gameDoc,
  updateGame,
}) {
  const handleDrop = event => {
    event.preventDefault();
    const row = event.target.dataset.rowIndex;
    const col = event.target.dataset.columnIndex;
    updateGame(gameRef, optionType, optionValue, row, col);
  };

  const handleDragOver = event => {
    event.preventDefault();
  };

  let round;
  try {
    round = gameDoc.roundArr[gameDoc.currentRound];
  } catch (error) {
    // console.log(error);
  }
  return (
    <div
      className="row"
      onDragOver={handleDragOver}
      onDrop={event => handleDrop(event)}>
      {round &&
        round.rowArr[rowIndex].guessArr.map((val, columnIndex) => (
          <Guess
            color={val}
            key={columnIndex}
            columnIndex={columnIndex}
            rowIndex={rowIndex}
          />
        ))}

      {round &&
        round.rowArr[rowIndex].clueArr.map((val, columnIndex) => (
          <Clue
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
        <Guess key={columnIndex} columnIndex={columnIndex} />
      ))}
    </div>
  );
}

function Guess({columnIndex, rowIndex, color}) {
  return (
    <p
      className="guess"
      style={{backgroundColor: color}}
      data-column-index={columnIndex}
      data-row-index={rowIndex}>
      {rowIndex}, {columnIndex}
    </p>
  );
}

function Clue({columnIndex, rowIndex, color}) {
  return (
    <p
      className="clue"
      style={{backgroundColor: color}}
      data-column-index={columnIndex}
      data-row-index={rowIndex}>
      {rowIndex}, {columnIndex}
    </p>
  );
}

export default function Board({gameDoc}) {
  let round;
  try {
    round = gameDoc.roundArr[gameDoc.currentRound];
  } catch (error) {
    // console.log(error);
  }

  return (
    <div className="board">
      {round &&
        round.rowArr.map((_val, rowIndex) => (
          <RowWithGame key={rowIndex} rowIndex={rowIndex} />
        ))}
      <Code />
    </div>
  );
}

export const RowWithGame = withGame(Row);
export const BoardWithGame = withGame(Board);
