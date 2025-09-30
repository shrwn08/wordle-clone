import React from 'react';
import './Game.css';

const Keyboard = ({ onKeyPress, getLetterStatus, theme }) => {
  const keyboardRows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE']
  ];

  const handleClick = (key) => {
    onKeyPress(key);
  };

  return (
    <div className="keyboard">
      {keyboardRows.map((row, i) => (
        <div key={i} className="keyboard-row">
          {row.map((key) => {
            const status = key.length === 1 ? getLetterStatus(key) : 'special';
            return (
              <button
                key={key}
                className={`key key-${status} ${key.length > 1 ? 'key-wide' : ''}`}
                onClick={() => handleClick(key)}
              >
                {key === 'BACKSPACE' ? '⌫' : key}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;