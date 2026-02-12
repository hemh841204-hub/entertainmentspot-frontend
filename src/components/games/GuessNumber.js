import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import useTracker from '../../utils/useTracker';
import CommentSection from '../CommentSection';

export default function GuessNumber() {
  const markUsed = useTracker('game', 'Guess the Number');
  const [target, setTarget] = useState(() => Math.floor(Math.random() * 100) + 1);
  const [guess, setGuess] = useState('');
  const [message, setMessage] = useState('I\'m thinking of a number between 1 and 100...');
  const [attempts, setAttempts] = useState(0);
  const [history, setHistory] = useState([]);
  const [won, setWon] = useState(false);

  const handleGuess = useCallback(() => {
    const num = parseInt(guess);
    if (isNaN(num) || num < 1 || num > 100) { setMessage('Please enter a valid number (1-100)'); return; }
    markUsed();
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    if (num === target) {
      setMessage(`🎉 Correct! You got it in ${newAttempts} attempts!`);
      setWon(true);
      setHistory([...history, { num, hint: '✅' }]);
    } else if (num < target) {
      setMessage('📈 Too low! Try higher.');
      setHistory([...history, { num, hint: '↑' }]);
    } else {
      setMessage('📉 Too high! Try lower.');
      setHistory([...history, { num, hint: '↓' }]);
    }
    setGuess('');
  }, [guess, target, attempts, history, markUsed]);

  const reset = () => { setTarget(Math.floor(Math.random() * 100) + 1); setGuess(''); setMessage('New game! Guess a number...'); setAttempts(0); setHistory([]); setWon(false); };

  return (
    <div className="page">
      <Link to="/games" className="back-btn">← Back</Link>
      <h2>🤔 Guess the Number</h2>
      <div className="tool-box" style={{ textAlign: 'center', maxWidth: '500px', margin: '0 auto' }}>
        <p style={{ fontSize: '1.2rem', margin: '1rem 0', color: won ? '#ffd700' : '#ccc' }}>{message}</p>
        <p style={{ color: '#888' }}>Attempts: {attempts}</p>
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', margin: '1rem 0' }}>
          <input type="number" min="1" max="100" value={guess} onChange={e => setGuess(e.target.value)} onKeyDown={e => e.key === 'Enter' && !won && handleGuess()} placeholder="Your guess" style={{ width: '120px' }} disabled={won} />
          {!won ? <button className="btn" onClick={handleGuess}>Guess</button> : <button className="btn" onClick={reset} style={{ background: 'linear-gradient(135deg, #06d6a0, #00d4ff)' }}>New Game</button>}
        </div>
        {history.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', justifyContent: 'center', marginTop: '1rem' }}>
            {history.map((h, i) => (
              <span key={i} style={{ padding: '4px 8px', borderRadius: '6px', fontSize: '0.85rem', background: h.hint === '✅' ? '#06d6a0' : h.hint === '↑' ? '#00d4ff33' : '#f7258533', color: '#fff' }}>
                {h.num} {h.hint}
              </span>
            ))}
          </div>
        )}
      </div>
      <CommentSection page="guess-number" />
    </div>
  );
}
