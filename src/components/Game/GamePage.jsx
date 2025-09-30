import React, { useState, useEffect, useCallback } from 'react';
import { getRandomWord, isValidWord } from '../../words';
import { gameService } from '../../services/gameService';
import GameBoard from './GameBoard';
import Keyboard from './Keyboard';
import GameModal from './GameModal';
import './Game.css';

const GamePage = ({ user, theme }) => {
  const [targetWord, setTargetWord] = useState('');
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [gameStatus, setGameStatus] = useState('playing');
  const [notification, setNotification] = useState('');
  const [shake, setShake] = useState(false);

  // Start new game on mount
  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    const newWord = getRandomWord();
    setTargetWord(newWord);
    setGuesses([]);
    setCurrentGuess('');
    setGameStatus('playing');
    setNotification('');
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 2000);
  };

  // Handle keyboard input
  const handleKeyPress = useCallback(
    (key) => {
      if (gameStatus !== 'playing') return;

      if (key === 'ENTER') {
        submitGuess();
      } else if (key === 'BACKSPACE') {
        setCurrentGuess((prev) => prev.slice(0, -1));
      } else if (/^[A-Z]$/.test(key) && currentGuess.length < 5) {
        setCurrentGuess((prev) => prev + key);
      }
    },
    [currentGuess, gameStatus]
  );

  // Listen for physical keyboard events
  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toUpperCase();
      if (key === 'ENTER') handleKeyPress('ENTER');
      else if (key === 'BACKSPACE') handleKeyPress('BACKSPACE');
      else if (/^[A-Z]$/.test(key)) handleKeyPress(key);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyPress]);

  // Submit a guess
  const submitGuess = async () => {
    if (currentGuess.length !== 5) {
      showNotification('Word must be 5 letters');
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    if (!isValidWord(currentGuess)) {
      showNotification('Not a valid word');
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    const newGuesses = [...guesses, currentGuess];
    setGuesses(newGuesses);
    setCurrentGuess('');

    if (currentGuess === targetWord) {
      setGameStatus('won');
      await saveGame(true, newGuesses.length);
      showNotification('Congratulations! 🎉');
    } else if (newGuesses.length >= 6) {
      setGameStatus('lost');
      await saveGame(false, newGuesses.length);
      showNotification(`Game Over! Word was ${targetWord}`);
    }
  };

  // Save game result to backend
  const saveGame = async (won, attempts) => {
    try {
      await gameService.saveGameResult({
        userId: user._id,
        won,
        attempts,
        word: targetWord,
      });
    } catch (error) {
      console.error('Failed to save game:', error);
    }
  };

  // Keyboard letter status (only considers submitted guesses)
  const getKeyboardLetterStatus = (letter) => {
    let status = 'unused';
    const letterUpper = letter.toUpperCase();

    for (const guess of guesses) {
      const targetLetters = targetWord.toUpperCase().split('');
      const guessLetters = guess.toUpperCase().split('');

      // First pass: exact matches (green)
      for (let i = 0; i < 5; i++) {
        if (guessLetters[i] === targetLetters[i]) {
          if (guessLetters[i] === letterUpper) return 'correct';
          targetLetters[i] = null;
          guessLetters[i] = null;
        }
      }

      // Second pass: present letters (yellow)
      for (let i = 0; i < 5; i++) {
        if (guessLetters[i] === letterUpper && guessLetters[i] !== null) {
          const indexInTarget = targetLetters.indexOf(letterUpper);
          if (indexInTarget !== -1) {
            status = 'present';
            targetLetters[indexInTarget] = null;
          } else if (status !== 'present') {
            status = 'absent';
          }
        }
      }
    }

    return status;
  };

  return (
    <div className="game-page">
      {notification && <div className="notification">{notification}</div>}

      <div className="game-container">
        <GameBoard
          guesses={guesses}
          currentGuess={currentGuess}
          solution={targetWord} // only for coloring submitted guesses
          shake={shake}
          theme={theme}
        />

        <Keyboard
          onKeyPress={handleKeyPress}
          getLetterStatus={getKeyboardLetterStatus}
          theme={theme}
        />
      </div>

      {gameStatus !== 'playing' && (
        <GameModal
          status={gameStatus}
          targetWord={targetWord}
          attempts={guesses.length}
          onNewGame={startNewGame}
          theme={theme}
        />
      )}
    </div>
  );
};

export default GamePage;
