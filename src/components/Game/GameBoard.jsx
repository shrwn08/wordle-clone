import React from 'react';
import './Game.css';

// Calculates statuses for a completed row only
const getRowStatuses = (guess, solution) => {
  const statuses = Array(guess.length).fill('absent');
  const solutionLetters = solution.split('');

  // Pass 1: correct letters (green)
  guess.split('').forEach((letter, idx) => {
    if (letter === solutionLetters[idx]) {
      statuses[idx] = 'correct';
      solutionLetters[idx] = null;
    }
  });

  // Pass 2: present letters (yellow)
  guess.split('').forEach((letter, idx) => {
    if (statuses[idx] === 'correct') return;
    const foundIndex = solutionLetters.indexOf(letter);
    if (foundIndex > -1) {
      statuses[idx] = 'present';
      solutionLetters[foundIndex] = null;
    }
  });

  return statuses;
};

const GameBoard = ({ guesses, currentGuess, solution, shake, theme }) => {
  const rows = [];

  for (let i = 0; i < 6; i++) {
    const isSubmittedRow = i < guesses.length;
    const isCurrentRow = i === guesses.length;
    const guess = isSubmittedRow ? guesses[i] : (isCurrentRow ? currentGuess : '');

    // Calculate statuses for submitted rows
    const rowStatuses = isSubmittedRow ? getRowStatuses(guess.toUpperCase(), solution.toUpperCase()) : [];

    const rowCells = Array(5)
      .fill('')
      .map((_, j) => ({
        letter: guess[j] || '',
        status: isSubmittedRow ? rowStatuses[j] : 'empty',
      }));

    rows.push({
      cells: rowCells,
      isCurrentGuess: isCurrentRow,
      isSubmitted: isSubmittedRow,
      rowIndex: i,
    });
  }

  return (
    <div className="game-board">
      {rows.map((row) => (
        <div
          key={row.rowIndex}
          className={`board-row ${row.isCurrentGuess && shake ? 'shake' : ''}`}
        >
          {row.cells.map((cell, j) => {
            const tileClasses = [
              'tile',
              cell.letter ? 'filled' : '',
              row.isSubmitted && cell.status !== 'empty' ? `tile-${cell.status}` : '',
              row.isCurrentGuess && cell.letter ? 'pop' : '',
              row.isSubmitted ? 'flip' : ''
            ].filter(Boolean).join(' ');

            return (
              <div
                key={j}
                className={tileClasses}
                style={row.isSubmitted ? { animationDelay: `${j * 0.1}s` } : {}}
              >
                {cell.letter}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default GameBoard;