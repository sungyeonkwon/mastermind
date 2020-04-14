import React from 'react';

import {GameConfig} from '../shared/config';
import {withGame} from '../providers/GameProvider';

function Row({
  optionType,
  optionValue,
  rowIndex,
  roundDoc,
  gameDoc,
  updateGame,
}) {
  const handleDrop = event => {
    event.preventDefault();
    const row = event.target.dataset.rowIndex;
    const col = event.target.dataset.columnIndex;
    const currentRoundRef = gameDoc.roundRefArr[gameDoc.currentRound];
    updateGame(currentRoundRef, optionType, optionValue, row, col);
  };

  const handleDragOver = event => {
    event.preventDefault();
  };

  return (
    <div
      className="row"
      onDragOver={handleDragOver}
      onDrop={event => handleDrop(event)}>
      {roundDoc.rowArr[rowIndex].guessArr.map((val, columnIndex) => (
        <Guess
          color={val}
          key={columnIndex}
          columnIndex={columnIndex}
          rowIndex={rowIndex}
        />
      ))}

      {roundDoc.rowArr[rowIndex].clueArr.map((val, columnIndex) => (
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
    <div
      className="guess"
      style={{backgroundColor: color}}
      data-column-index={columnIndex}
      data-row-index={rowIndex}>
      {rowIndex}, {columnIndex}
    </div>
  );
}

function Clue({columnIndex, rowIndex, color}) {
  return (
    <div
      className="clue"
      style={{backgroundColor: color}}
      data-column-index={columnIndex}
      data-row-index={rowIndex}>
      {rowIndex}, {columnIndex}
    </div>
  );
}

export default function Board({roundDoc}) {
  return (
    <div className="board">
      {roundDoc &&
        roundDoc.rowArr.map((_val, rowIndex) => (
          <RowWithGame key={rowIndex} rowIndex={rowIndex} />
        ))}
      <Code />
    </div>
  );
}

export const RowWithGame = withGame(Row);
export const BoardWithGame = withGame(Board);
