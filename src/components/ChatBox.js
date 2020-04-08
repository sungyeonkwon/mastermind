import React, {useState} from 'react';

export default function ChatBox() {
  const [value, setValue] = useState('');

  const handleChange = event => {
    setValue(event.target.value);
  };

  const handleKeyDown = event => {
    if (event.key === 'Enter') {
      // TODO: Push to ChatDocument, referenced from RoundDocument.
    }
  };

  return (
    <div className="chat-box">
      <div>
        <p>Chat line 1</p>
        <p>Chat line 2</p>
      </div>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}
