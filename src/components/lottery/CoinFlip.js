import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useTracker from '../../utils/useTracker';
import CommentSection from '../CommentSection';

export default function CoinFlip() {
  const markUsed = useTracker('lottery', 'Coin Flip');
  const [result, setResult] = useState(null);
  const [flipping, setFlipping] = useState(false);
  const [stats, setStats] = useState({ heads: 0, tails: 0 });

  const flip = () => {
    markUsed();
    setFlipping(true);
    setResult(null);
    setTimeout(() => {
      const r = Math.random() < 0.5 ? 'Heads' : 'Tails';
      setResult(r);
      setStats(s => ({ ...s, [r.toLowerCase()]: s[r.toLowerCase()] + 1 }));
      setFlipping(false);
    }, 1000);
  };

  return (
    <div className="page">
      <Link to="/lottery" className="back-btn">← Back</Link>
      <h2>🪙 Coin Flip</h2>
      <div className="tool-box" style={{ textAlign: 'center' }}>
        <div className={`coin ${flipping ? 'flipping' : ''}`}>
          {result ? (result === 'Heads' ? '👑' : '🌿') : '🪙'}
        </div>
        {result && <div style={{ fontSize: '2rem', fontFamily: 'Orbitron', color: result === 'Heads' ? '#ffd700' : '#00d4ff', marginBottom: '1rem' }}>{result}!</div>}
        <button className="btn" onClick={flip} disabled={flipping}>{flipping ? 'Flipping...' : '🪙 Flip!'}</button>
        <div style={{ marginTop: '1.5rem', color: '#888' }}>
          Heads: {stats.heads} | Tails: {stats.tails}
        </div>
      </div>
      <CommentSection page="coin-flip" />
    </div>
  );
}
