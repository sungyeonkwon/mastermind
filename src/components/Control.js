import React from 'react';
import {ChatBoxWithGame} from './ChatBox';
import OptionBox from './OptionBox';

export default function Control() {
  return (
    <div className="control">
      <ChatBoxWithGame />
      <OptionBox />
      <button>Submit decision</button>
    </div>
  );
}
