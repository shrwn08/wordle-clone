// components/Game/GameBoard.jsx
import React from 'react';
import './Game.css';

const GameBoard = ({ guesses, currentGuess, getLetterStatus, shake, theme }) => {
  const rows = [];

  for (let i = 0; i < 6; i++) {
    const guess = i < guesses.length ? guesses[i] : (i === guesses.length ? currentGuess : '');
    const row = [];

    for (let j = 0; j < 5; j++) {
      const letter = guess[j] || '';
      const status = i < guesses.length ? getLetterStatus(letter, j, i) : 'empty';
      row.push({ letter, status });
    }
    rows.push({ cells: row, isCurrentGuess: i === guesses.length, rowIndex: i });
  }

  return (
    <div className="game-board">
      {rows.map((row) => (
        <div
          key={row.rowIndex}
          className={`board-row ${row.isCurrentGuess && shake ? 'shake' : ''}`}
        >
          {row.cells.map((cell, j) => (
            <div
              key={j}
              className={`tile tile-${cell.status} ${cell.letter ? 'filled' : ''} ${
                row.isCurrentGuess && cell.letter ? 'pop' : ''
              }`}
            >
              {cell.letter}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default GameBoard;