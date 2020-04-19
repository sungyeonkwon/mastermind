import React from 'react';

import {withGame} from '../providers/GameProvider';
import {updateGame} from '../services/game';

export function Spot({
  columnIndex,
  rowIndex,
  color,
  spotType,
  gameRef,
  optionType,
  optionValue,
  optionEl,
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
    optionEl.remove();
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
      style={{background: `radial-gradient(white 0%, ${color} 75%)`}}
      data-column-index={columnIndex}
      data-row-index={rowIndex}></p>
  );
}

export const SpotWithGame = withGame(Spot);
