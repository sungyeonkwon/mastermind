import React, {useState, useEffect} from 'react';

import {withUser} from '../providers/UserProvider';
import {withGame} from '../providers/GameProvider';
import {collectIdsandDocs} from '../shared/utils';

export default function ChatBox({user, gameRef, chatRef}) {
  const [value, setValue] = useState('');
  const [chatContent, setChatContent] = useState('');

  // Subscribe to the chat doc.
  useEffect(() => {
    if (chatRef) {
      chatRef.onSnapshot(snapshot => {
        const chatData = collectIdsandDocs(snapshot);
        setChatContent(chatData.chatContent);
      });
    }
  }, [chatRef, chatContent.length]);

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
      if (chatRef) {
        chatRef.set({chatContent: [...chatContent, line]});
        setValue('');
      }
    }
  };

  return (
    <div className="chat-box">
      <div>
        {chatContent.length &&
          chatContent.map(({message, timestamp}, index) => (
            <p key={index}>{message}</p>
          ))}
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

export const ChatBoxWithGame = withGame(withUser(ChatBox));
