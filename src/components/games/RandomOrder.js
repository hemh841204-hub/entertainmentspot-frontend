import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import CommentSection from '../CommentSection';
import useTracker from '../../utils/useTracker';

export default function RandomOrder() {
  const [names, setNames] = useState('');
  const [ordered, setOrdered] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const intervalRef = useRef(null);
  const markUsed = useTracker('lottery', 'random-order');

  const handleStart = () => {
    const nameList = names.split('\n').map(n => n.trim()).filter(n => n);
    if (nameList.length < 2) return alert('Please enter at least 2 names (one per line)');

    markUsed();
    setShowResult(false);
    setIsAnimating(true);

    let count = 0;
    intervalRef.current = setInterval(() => {
      const shuffled = [...nameList].sort(() => Math.random() - 0.5);
      setOrdered(shuffled);
      count++;
      if (count >= 25) {
        clearInterval(intervalRef.current);
        setIsAnimating(false);
        setShowResult(true);
      }
    }, 80);
  };

  const getMedal = (i) => {
    if (i === 0) return '🥇';
    if (i === 1) return '🥈';
    if (i === 2) return '🥉';
    return `${i + 1}`;
  };

  const getBarColor = (i, total) => {
    const hue = 200 - (i / total) * 160;
    return `hsl(${hue}, 80%, 55%)`;
  };

  return (
    <div className="page">
      <Link to="/lottery" className="back-btn">← Back to Lottery Tools</Link>
      <h2>🔀 Random Order</h2>
      <div className="tool-box">
        <div className="form-group">
          <label>Enter names (one per line)</label>
          <textarea
            rows={8}
            value={names}
            onChange={e => setNames(e.target.value)}
            placeholder="Alice&#10;Bob&#10;Charlie&#10;Diana&#10;..."
            style={{ resize: 'vertical' }}
          />
        </div>
        <button className="btn" onClick={handleStart} disabled={isAnimating}>
          {isAnimating ? '🔀 Shuffling...' : '🚀 Start Shuffle'}
        </button>

        {ordered.length > 0 && (
          <div style={{ marginTop: '2rem' }}>
            {ordered.map((name, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                marginBottom: '0.5rem',
                animation: showResult ? `slideIn 0.4s ease ${i * 0.08}s both` : 'none',
              }}>
                <div style={{
                  width: '40px',
                  textAlign: 'center',
                  fontSize: i < 3 && showResult ? '1.5rem' : '1rem',
                  color: showResult ? getBarColor(i, ordered.length) : '#888',
                  fontWeight: 'bold',
                  fontFamily: 'Orbitron, sans-serif',
                  transition: 'all 0.3s',
                }}>
                  {showResult ? getMedal(i) : i + 1}
                </div>
                <div style={{
                  flex: 1,
                  position: 'relative',
                  height: '44px',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  background: 'rgba(255,255,255,0.03)',
                }}>
                  <div style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    height: '100%',
                    width: showResult ? `${100 - (i / ordered.length) * 70}%` : '100%',
                    background: `linear-gradient(90deg, ${getBarColor(i, ordered.length)}33, ${getBarColor(i, ordered.length)}11)`,
                    borderRadius: '8px',
                    transition: 'width 0.5s ease',
                  }} />
                  <div style={{
                    position: 'relative',
                    padding: '0.7rem 1rem',
                    color: '#e0e0e0',
                    fontSize: '1rem',
                    fontWeight: i < 3 && showResult ? '600' : '400',
                    zIndex: 1,
                  }}>
                    {name}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <CommentSection page="random-order" />
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
