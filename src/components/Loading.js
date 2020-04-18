import React from 'react';

export default function Loading({hide}) {
  return <div className={`loading ${hide}`}>Loading the game...</div>;
}
