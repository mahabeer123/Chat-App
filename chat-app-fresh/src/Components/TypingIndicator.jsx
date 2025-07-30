import React from 'react';

const TypingIndicator = ({ typers }) => {
  if (!typers || typers.length === 0) return null;

  const getTypingText = () => {
    if (typers.length === 1) {
      return `${typers[0].name} is typing...`;
    } else if (typers.length === 2) {
      return `${typers[0].name} and ${typers[1].name} are typing...`;
    } else {
      return 'Several people are typing...';
    }
  };

  return (
    <div className="flex items-center gap-2 px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
      <div className="flex gap-1">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>
      <span>{getTypingText()}</span>
    </div>
  );
};

export default TypingIndicator; 