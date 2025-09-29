// components/Game/GameModal.jsx
import React from 'react';
import './Game.css';

const GameModal = ({ status, targetWord, attempts, onNewGame, theme }) => {
  return (
    <div className="modal-overlay">
      <div className={`modal ${theme}`}>
        <div className="modal-content">
          <div className="modal-icon">
            {status === 'won' ? '🎉' : '😢'}
          </div>
          <h2 className="modal-title">
            {status === 'won' ? 'Congratulations!' : 'Game Over'}
          </h2>
          <p className="modal-message">
            {status === 'won'
              ? `You solved it in ${attempts} ${attempts === 1 ? 'guess' : 'guesses'}!`
              : `Better luck next time!`}
          </p>
          <div className="modal-word">
            <span>The word was:</span>
            <strong>{targetWord}</strong>
          </div>
          <button className="modal-button" onClick={onNewGame}>
            Play Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameModal;