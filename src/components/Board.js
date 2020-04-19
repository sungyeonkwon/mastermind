import React from 'react';

import {GameConfig} from '../shared/config';
import {withGame} from '../providers/GameProvider';
import {withUser} from '../providers/UserProvider';
import {isCodebreaker, getRoundDoc} from '../shared/utils';
import {updateGame} from '../services/game';

export default function Board({gameDoc, user}) {
  let round, codebreaker, codeArr;

  try {
    round = getRoundDoc(gameDoc);
    codeArr = round.codeArr;
    codebreaker = isCodebreaker(gameDoc, user);
  } catch (error) {}

  return (
    <div className="board">
      <div style={{order: codebreaker && 1}}>
        {round &&
          round.rowArr.map((_val, rowIndex) => (
            <RowWithGame key={rowIndex} rowIndex={rowIndex} />
          ))}
      </div>
      <Code codeArr={codeArr} />
    </div>
  );
}

function Row({rowIndex, user, round, gameDoc}) {
  let guessArr, clueArr, index;

  try {
    round = getRoundDoc(gameDoc);
    guessArr = round.rowArr[rowIndex].guessArr;
    clueArr = round.rowArr[rowIndex].clueArr;
    index = isCodebreaker(gameDoc, user)
      ? GameConfig.rowCount - rowIndex
      : rowIndex + 1;
  } catch (error) {}

  return (
    <div className="row">
      <span className="index label">{index}</span>
      {guessArr &&
        guessArr.length &&
        guessArr.map((val, columnIndex) => (
          <SpotWithGame
            spotType="guess"
            color={val}
            key={columnIndex}
            columnIndex={columnIndex}
            rowIndex={rowIndex}
          />
        ))}

      {clueArr &&
        clueArr.length &&
        clueArr.map((val, columnIndex) => (
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

function Code({codeArr}) {
  return (
    <div className="answer">
      {codeArr &&
        codeArr.length &&
        codeArr.map((val, columnIndex) => (
          <SpotWithGame
            spotType="code"
            color={val}
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

export const RowWithGame = withGame(withUser(Row));
export const SpotWithGame = withGame(Spot);
export const BoardWithGame = withGame(withUser(Board));
