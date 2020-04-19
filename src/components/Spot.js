import React from 'react';

import {withGame} from '../providers/GameProvider';
import {placePeg} from '../services/game';

export function Spot({
  columnIndex,
  rowIndex,
  color,
  spotType,
  gameRef,
  optionType,
  optionValue,
  optionEl,
  setOptionType,
  setOptionValue,
  setOptionEl,
}) {
  const handleDragOver = event => {
    event.preventDefault();
  };

  // TODO: Use throttle.
  const handleDragStart = event => {
    setOptionEl(event.target);
    setOptionType(event.target.dataset.type);
    setOptionValue(event.target.dataset.value);
  };

  const handleDrop = event => {
    event.preventDefault();

    if (!optionEl.classList.contains('peg')) return;

    event.target.style.transform = 'scale(1)';
    const row = event.target.dataset.rowIndex;
    const col = event.target.dataset.columnIndex;

    placePeg(gameRef, optionType, optionValue, row, col, spotType);

    // Assign type and value to the spot.
    event.target.setAttribute('data-type', optionType);
    event.target.setAttribute('data-value', optionValue);

    // Remove the element.
    optionEl.remove();
  };

  const handleDragEnter = event => {
    event.target.style.transform = 'scale(1.3)';
  };

  const handleDragLeave = event => {
    event.target.style.transform = 'scale(1)';
  };

  // TODO: Make area draggable only if there's a peg.
  return (
    <p
      draggable
      onDrop={event => handleDrop(event)}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragStart={handleDragStart}
      className={spotType}
      style={{background: `radial-gradient(white 0%, ${color} 75%)`}}
      data-column-index={columnIndex}
      data-row-index={rowIndex}></p>
  );
}

export const SpotWithGame = withGame(Spot);
