import React, {useEffect, useState} from 'react';
import {useCallbackRef} from 'use-callback-ref';

import {withGame} from '../providers/GameProvider';
import {coordsInRange} from '../shared/utils';
import {guessArr, clueArr} from '../shared/constants';

export default function OptionBox({
  gameDoc,
  setOptionType,
  setOptionValue,
  setOptionEl,
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

  useEffect(() => {
    if (guessContainerRect) {
      const {left, right, top, bottom} = guessContainerRect;
      const guessPool = guessArr.map(value => {
        const pos = coordsInRange(left, right, top, bottom);
        return {
          ...pos,
          value,
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
          value,
        };
      });
      setCluePool(cluePool);
    }
  }, [guessContainerRect, clueContainerRect]);

  return (
    <div className="option-box">
      <div className="group group-guess">
        <p className="label">Guess Pegs</p>
        <div ref={guessContainer}>
          {guessPool &&
            guessPool.map((obj, index) => {
              return (
                <div
                  className="peg guess"
                  style={{
                    background: `radial-gradient(white 0%, ${obj.value} 75%)`,
                    left: obj.x,
                    top: obj.y,
                  }}
                  draggable
                  key={index}
                  color={obj.value}
                  data-type="guess"
                  data-value={obj.value}
                  onDrag={handleDrag}></div>
              );
            })}
        </div>
      </div>
      <div className="group group-clue">
        <p className="label">Clue Pegs</p>
        <div ref={clueContainer}>
          {cluePool &&
            cluePool.map((obj, index) => {
              return (
                <div
                  className="peg clue"
                  style={{
                    background: `radial-gradient(white 0%, ${obj.value} 75%)`,
                    left: obj.x,
                    top: obj.y,
                  }}
                  draggable
                  key={index}
                  data-type="clue"
                  data-value={obj.value}
                  onDrag={handleDrag}></div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

export const OptionBoxWithGame = withGame(OptionBox);
