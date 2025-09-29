// components/Game/GamePage.jsx
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
  const [gameStatus, setGameStatus] = useState('playing'); // playing, won, lost
  const [notification, setNotification] = useState('');
  const [shake, setShake] = useState(false);

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

  const handleKeyPress = useCallback((key) => {
    if (gameStatus !== 'playing') return;

    if (key === 'ENTER') {
      submitGuess();
    } else if (key === 'BACKSPACE') {
      setCurrentGuess(prev => prev.slice(0, -1));
    } else if (/^[A-Z]$/.test(key) && currentGuess.length < 5) {
      setCurrentGuess(prev => prev + key);
    }
  }, [currentGuess, gameStatus]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toUpperCase();
      if (key === 'ENTER') {
        handleKeyPress('ENTER');
      } else if (key === 'BACKSPACE') {
        handleKeyPress('BACKSPACE');
      } else if (/^[A-Z]$/.test(key)) {
        handleKeyPress(key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyPress]);

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

  const saveGame = async (won, attempts) => {
    try {
      await gameService.saveGameResult({
        userId: user._id,
        won,
        attempts,
        word: targetWord
      });
    } catch (error) {
      console.error('Failed to save game:', error);
    }
  };

  const getLetterStatus = (letter, position, guessIndex) => {
    const guess = guesses[guessIndex];
    if (!guess) return 'empty';

    if (guess[position] === targetWord[position]) {
      return 'correct';
    }

    // Two-pass algorithm for yellow tiles
    const targetLetters = targetWord.split('');
    const guessLetters = guess.split('');

    // Mark all green matches
    for (let i = 0; i < 5; i++) {
      if (guessLetters[i] === targetLetters[i]) {
        targetLetters[i] = null;
        guessLetters[i] = null;
      }
    }

    // Check if current letter should be yellow
    if (position < guess.length && guess[position] !== targetWord[position]) {
      const letterToCheck = guess[position];
      const indexInTarget = targetLetters.indexOf(letterToCheck);
      if (indexInTarget !== -1) {
        return 'present';
      }
    }

    return 'absent';
  };

  const getKeyboardLetterStatus = (letter) => {
    let status = 'unused';
    for (const guess of guesses) {
      for (let i = 0; i < guess.length; i++) {
        if (guess[i] === letter) {
          if (guess[i] === targetWord[i]) {
            return 'correct';
          } else if (targetWord.includes(letter)) {
            status = 'present';
          } else {
            status = 'absent';
          }
        }
      }
    }
    return status;
  };

  return (
    <div className="game-page">
      {notification && (
        <div className="notification">{notification}</div>
      )}

      <div className="game-container">
        <GameBoard
          guesses={guesses}
          currentGuess={currentGuess}
          getLetterStatus={getLetterStatus}
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