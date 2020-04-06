import React from 'react';
import ChatBox from './ChatBox';
import OptionBox from './OptionBox';

export default function Control() {
  return (
    <div className="control">
      <ChatBox />
      <OptionBox />
      <button>Submit decision</button>
    </div>
  );
}
