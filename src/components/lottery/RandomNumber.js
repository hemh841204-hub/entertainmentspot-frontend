import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useTracker from '../../utils/useTracker';
import CommentSection from '../CommentSection';

export default function RandomNumber() {
  const markUsed = useTracker('lottery', 'Random Number');
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [result, setResult] = useState(null);
  const [animating, setAnimating] = useState(false);

  const generate = () => {
    markUsed();
    setAnimating(true);
    let count = 0;
    const interval = setInterval(() => {
      setResult(Math.floor(Math.random() * (max - min + 1)) + min);
      count++;
      if (count > 15) { clearInterval(interval); setAnimating(false); }
    }, 80);
  };

  return (
    <div className="page">
      <Link to="/lottery" className="back-btn">← Back</Link>
      <h2>🔢 Random Number</h2>
      <div className="tool-box" style={{ textAlign: 'center' }}>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '1.5rem', alignItems: 'center' }}>
          <div>
            <label style={{ color: '#aaa', display: 'block', fontSize: '0.85rem' }}>Min</label>
            <input type="number" value={min} onChange={e => setMin(Number(e.target.value))} style={{ width: '100px' }} />
          </div>
          <span style={{ color: '#555', fontSize: '1.5rem', paddingTop: '1rem' }}>~</span>
          <div>
            <label style={{ color: '#aaa', display: 'block', fontSize: '0.85rem' }}>Max</label>
            <input type="number" value={max} onChange={e => setMax(Number(e.target.value))} style={{ width: '100px' }} />
          </div>
        </div>
        {result !== null && (
          <div style={{ fontSize: '4rem', fontFamily: 'Orbitron', fontWeight: 900, background: 'linear-gradient(135deg, #00d4ff, #f72585)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: '1rem 0', transition: 'all 0.1s' }}>
            {result}
          </div>
        )}
        <button className="btn" onClick={generate} disabled={animating}>{animating ? 'Generating...' : '⚡ Generate'}</button>
      </div>
      <CommentSection page="random-number" />
    </div>
  );
}
