import React from 'react';
import {ChatBoxWithGame} from './ChatBox';
import {OptionBoxWithGame} from './OptionBox';

export default function Control() {
  return (
    <div className="control">
      <ChatBoxWithGame />
      <OptionBoxWithGame />
    </div>
  );
}
