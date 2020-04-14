import React from 'react';

import {GameConfig} from '../shared/config';
import {withGame} from '../providers/GameProvider';

function Row({optionType, optionValue, rowIndex}) {
  const handleDrop = event => {
    event.preventDefault();

    // target is the spot element.
    console.log('handleDrop C index', event.target.dataset.columnIndex);
    console.log('handleDrop R index', event.target.dataset.rowIndex);
  };

  const handleDragOver = event => {
    event.preventDefault();
  };

  return (
    <div
      className="row"
      onDragOver={handleDragOver}
      onDrop={event => handleDrop(event)}>
      {[...Array(GameConfig.guessSpotCount).keys()].map((_val, columnIndex) => (
        <Guess
          key={columnIndex}
          columnIndex={columnIndex}
          rowIndex={rowIndex}
        />
      ))}

      {[...Array(GameConfig.guessSpotCount).keys()].map((_val, columnIndex) => (
        <Clue key={columnIndex} columnIndex={columnIndex} rowIndex={rowIndex} />
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

function Guess({columnIndex, rowIndex}) {
  return (
    <div
      className="guess"
      data-column-index={columnIndex}
      data-row-index={rowIndex}>
      {rowIndex}, {columnIndex}
    </div>
  );
}

function Clue({columnIndex, rowIndex}) {
  return (
    <div
      className="clue"
      data-column-index={columnIndex}
      data-row-index={rowIndex}>
      {rowIndex}, {columnIndex}
    </div>
  );
}

export default function Board() {
  return (
    <div className="board">
      {[...Array(GameConfig.rowCount).keys()].map((_val, rowIndex) => (
        <RowWithGame key={rowIndex} rowIndex={rowIndex} />
      ))}
      <Code />
    </div>
  );
}

export const RowWithGame = withGame(Row);
