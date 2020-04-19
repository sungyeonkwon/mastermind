import React, {useEffect, useState} from 'react';
import {useCallbackRef} from 'use-callback-ref';

import {withGame} from '../providers/GameProvider';
import {coordsInRange} from '../shared/utils';
import {guessArr, clueArr} from '../shared/constants';

export default function OptionBox({
  setOptionType,
  setOptionValue,
  setOptionEl,
  optionEl,
  optionType,
  optionValue,
}) {
  const [guessPool, setGuessPool] = useState(null);
  const [cluePool, setCluePool] = useState(null);
  const [guessContainerRect, setGuessContainerRect] = useState(null);
  const [clueContainerRect, setClueContainerRect] = useState(null);
  const guessContainer = useCallbackRef(null, () =>
    setGuessContainerRect(guessContainer.current.getBoundingClientRect())
  );
  const clueContainer = useCallbackRef(null, () =>
    setClueContainerRect(clueContainer.current.getBoundingClientRect())
  );

  // TODO: Use throttle.
  const handleDrag = event => {
    setOptionEl(event.target);
    setOptionType(event.target.dataset.type);
    setOptionValue(event.target.dataset.value);
  };

  const handleDragOver = event => {
    event.preventDefault();
  };

  const handleDragEnter = event => {
    // TODO: highlight option box.
    // Make sure the type of pegs are the same.
  };

  const handleDrop = event => {
    event.preventDefault();

    console.log('event.target', event.clientX);
    console.log('event.target', event.clientY);
    console.log('@---optionType', optionType);
    console.log('@---optionValue', optionValue);

    const el = document.createElement('div');
    el.className = `peg ${optionType}`;
    el.draggable = true;
    el.dataset.type = optionType;
    el.dataset.value = optionValue;
    el.style.background = `radial-gradient(white 0%, ${optionValue} 75%)`;
    const left = event.clientX - guessContainerRect.left + 'px';
    const top = event.clientY - clueContainerRect.top + 'px';
    el.style.left = left;
    el.style.top = top;
    console.log(el);
    // TODO: Put dynamic value.
    el.style.transform = 'translate(-25px, -25px)';

    guessContainer.current.appendChild(el);
  };

  useEffect(() => {
    if (guessContainerRect) {
      const {left, right, top, bottom} = guessContainerRect;
      const guessPool = guessArr.map(value => {
        const pos = coordsInRange(left, right, top, bottom);
        return {
          ...pos,
          color: value,
          type: 'guess',
        };
      });
      setGuessPool(guessPool);
    }

    if (clueContainerRect) {
      const {left, right, top, bottom} = clueContainerRect;
      const cluePool = clueArr.map(value => {
        const pos = coordsInRange(left, right, top, bottom);
        return {
          ...pos,
          color: value,
          type: 'clue',
        };
      });
      setCluePool(cluePool);
    }
  }, [guessContainerRect, clueContainerRect]);

  return (
    <div className="option-box">
      <div className="group group-guess">
        <p className="label">Guess Pegs</p>
        <div
          ref={guessContainer}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDrop={event => handleDrop(event)}>
          {guessPool &&
            guessPool.map((obj, index) => {
              return (
                <div
                  className="peg guess"
                  style={{
                    background: `radial-gradient(white 0%, ${obj.color} 75%)`,
                    left: obj.x,
                    top: obj.y,
                  }}
                  draggable
                  onDrag={handleDrag}
                  key={index}
                  data-type="guess"
                  data-value={obj.color}></div>
              );
            })}
        </div>
      </div>
      <div className="group group-clue">
        <p className="label">Clue Pegs</p>
        <div
          ref={clueContainer}
          onDragOver={handleDragOver}
          onDragEnter={handleDragEnter}
          onDrop={event => handleDrop(event)}>
          {cluePool &&
            cluePool.map((obj, index) => {
              return (
                <div
                  className="peg clue"
                  style={{
                    background: `radial-gradient(white 0%, ${obj.color} 75%)`,
                    left: obj.x,
                    top: obj.y,
                  }}
                  draggable
                  onDrag={handleDrag}
                  key={index}
                  data-type="clue"
                  data-value={obj.color}></div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

export const OptionBoxWithGame = withGame(OptionBox);
