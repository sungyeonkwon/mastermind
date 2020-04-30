import React, {useState, useEffect} from 'react';

import {withUser} from '../providers/UserProvider';
import {withGame} from '../providers/GameProvider';
import {NarrationType} from '../services/narrator';
import {getRoundDoc} from '../shared/utils';

export default function ChatBox({user, gameRef, gameDoc, narrator}) {
  const [value, setValue] = useState('');
  const [chatContent, setChatContent] = useState('');

  useEffect(() => {
    if (gameDoc) {
      // Update narrator member variables.
      const currRound = getRoundDoc(gameDoc);
      if (currRound.codemaker && !narrator.codemaker) {
        narrator.codemaker = currRound.codemaker.displayName;
      }
      if (currRound.codebreaker && !narrator.codebreaker) {
        narrator.codebreaker = currRound.codemaker.displayName;
      }

      setChatContent(gameDoc.chatContent);
    }
  }, [gameDoc, narrator.codemaker, narrator.codebreaker]);

  const handleChange = event => {
    setValue(event.target.value);
  };

  const handleKeyDown = event => {
    // Only take action when enter key is pressed.
    if (!(event.key === 'Enter')) return;

    const message =
      value === 'rules' ? narrator.getMessage(NarrationType.rules) : value;
    const isNarration = value === 'rules';

    const line = {
      isNarration,
      message,
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
  };

  const isChatLoaded =
    gameDoc && gameDoc.chatContent && gameDoc.chatContent.length;

  const getUserMessage = (message, name) => {
    const formatedMessage = `<span>↳ ${name} </span> ${message}`;
    return {
      __html: formatedMessage,
    };
  };

  return (
    <div>
      <div className="chat-box">
        {isChatLoaded &&
          gameDoc.chatContent.map(({user, message, isNarration}, index) => {
            if (isNarration) {
              return (
                <p
                  key={index}
                  className="narration"
                  dangerouslySetInnerHTML={{__html: message}}></p>
              );
            } else {
              return (
                <p
                  key={index}
                  dangerouslySetInnerHTML={getUserMessage(
                    message,
                    user.displayName
                  )}></p>
              );
            }
          })}
        <div className="spacer"></div>
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
