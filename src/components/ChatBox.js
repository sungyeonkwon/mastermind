import React, {useState, useEffect} from 'react';

import {withUser} from '../providers/UserProvider';
import {withGame} from '../providers/GameProvider';

export default function ChatBox({user, gameRef, gameDoc}) {
  const [value, setValue] = useState('');
  const [chatContent, setChatContent] = useState('');

  useEffect(() => {
    if (gameDoc) {
      setChatContent(gameDoc.chatContent);
    }
  }, [gameDoc]);

  const handleChange = event => {
    setValue(event.target.value);
  };

  const handleKeyDown = event => {
    if (event.key === 'Enter') {
      const line = {
        isNarration: false,
        message: value,
        timestamp: new Date(),
        user: user,
      };
      if (gameRef) {
        gameRef
          .update({chatContent: [...chatContent, line]})
          .then(() => setValue(''));
      }

      // Scroll to bottom.
      document.querySelector('.spacer').scrollIntoView();
    }
  };

  return (
    <div>
      <div className="chat-box">
        {gameDoc &&
          gameDoc.chatContent &&
          gameDoc.chatContent.length &&
          gameDoc.chatContent.map(({user, message, isNarration}, index) => (
            <p key={index} className={isNarration && 'narration'}>
              <span>{!isNarration && ' ↳ ' + user.displayName + ' '} </span>
              {message}
            </p>
          ))}
        <div class="spacer"></div>
      </div>
      <input
        placeholder="Type whatever."
        type="text"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
}

export const ChatBoxWithGame = withGame(withUser(ChatBox));
