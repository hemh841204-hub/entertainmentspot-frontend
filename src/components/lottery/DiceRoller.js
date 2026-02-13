import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useTracker from '../../utils/useTracker';
import CommentSection from '../CommentSection';

const faces = ['⚀','⚁','⚂','⚃','⚄','⚅'];

export default function DiceRoller() {
  const markUsed = useTracker('lottery', 'Dice Roller');
  const [count, setCount] = useState(2);
  const [results, setResults] = useState([]);
  const [rolling, setRolling] = useState(false);

  const roll = () => {
    markUsed();
    setRolling(true);
    setTimeout(() => {
      const r = Array.from({ length: count }, () => Math.floor(Math.random() * 6) + 1);
      setResults(r);
      setRolling(false);
    }, 500);
  };

  return (
    <div className="page">
      <Link to="/lottery" className="back-btn">← Back</Link>
      <h2>🎲 Dice Roller</h2>
      <div className="tool-box" style={{ textAlign: 'center' }}>
        <div style={{ marginBottom: '1rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}>
          <label style={{ color: '#aaa', marginRight: '0.5rem', width: '100%', textAlign: 'center', marginBottom: '0.3rem' }}>Number of dice:</label>
          {[1,2,3,4,5,6].map(n => (
            <button key={n} className="btn" style={{ margin: '0.2rem', padding: '0.4rem 0.8rem', background: n === count ? 'linear-gradient(135deg, #00d4ff, #7c3aed)' : '#333' }} onClick={() => setCount(n)}>{n}</button>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', minHeight: '100px', alignItems: 'center' }}>
          {results.map((r, i) => (
            <div key={i} className={`dice ${rolling ? 'rolling' : ''}`}>{faces[r - 1]}</div>
          ))}
        </div>
        {results.length > 0 && <p style={{ fontSize: '1.3rem', color: '#00d4ff', margin: '1rem 0' }}>Total: {results.reduce((a, b) => a + b, 0)}</p>}
        <button className="btn" onClick={roll} disabled={rolling}>{rolling ? 'Rolling...' : '🎲 Roll!'}</button>
      </div>
      <CommentSection page="dice-roller" />
    </div>
  );
}
