import React from 'react';

import {SpotWithGame} from './Spot';

export default function Code({codeArr}) {
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
