import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import useTracker from '../../utils/useTracker';
import CommentSection from '../CommentSection';

export default function LuckyDraw() {
  const markUsed = useTracker('lottery', 'Lucky Draw');
  const [names, setNames] = useState(['Alice', 'Bob', 'Charlie', 'Diana', 'Eve']);
  const [newName, setNewName] = useState('');
  const [winner, setWinner] = useState('');
  const [highlight, setHighlight] = useState(-1);
  const [drawing, setDrawing] = useState(false);
  const intervalRef = useRef(null);

  const addName = () => { if (newName.trim()) { setNames([...names, newName.trim()]); setNewName(''); } };
  const removeName = (i) => setNames(names.filter((_, idx) => idx !== i));

  const draw = () => {
    if (names.length < 2 || drawing) return;
    markUsed();
    setDrawing(true);
    setWinner('');
    let count = 0;
    intervalRef.current = setInterval(() => {
      setHighlight(Math.floor(Math.random() * names.length));
      count++;
      if (count > 20) {
        clearInterval(intervalRef.current);
        const idx = Math.floor(Math.random() * names.length);
        setHighlight(idx);
        setWinner(names[idx]);
        setDrawing(false);
      }
    }, 100);
  };

  return (
    <div className="page">
      <Link to="/lottery" className="back-btn">← Back</Link>
      <h2>🎯 Lucky Draw</h2>
      <div className="tool-box" style={{ textAlign: 'center' }}>
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginBottom: '1rem' }}>
          <input style={{ width: '200px' }} value={newName} onChange={e => setNewName(e.target.value)} placeholder="Add a name" onKeyDown={e => e.key === 'Enter' && addName()} />
          <button className="btn" onClick={addName}>Add</button>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center', marginBottom: '1.5rem' }}>
          {names.map((name, i) => (
            <span key={i} style={{
              padding: '8px 16px', borderRadius: '8px', fontSize: '1rem', cursor: 'pointer',
              background: highlight === i ? 'linear-gradient(135deg, #ffd700, #f72585)' : '#16162a',
              color: highlight === i ? '#fff' : '#ccc',
              border: `1px solid ${highlight === i ? '#ffd700' : 'rgba(255,255,255,0.1)'}`,
              transform: highlight === i ? 'scale(1.1)' : 'scale(1)',
              transition: 'all 0.1s'
            }} onClick={() => !drawing && removeName(i)}>
              {name}
            </span>
          ))}
        </div>
        <button className="btn" onClick={draw} disabled={drawing || names.length < 2}>
          {drawing ? 'Drawing...' : '🎯 Draw Winner!'}
        </button>
        {winner && <div style={{ marginTop: '1.5rem', fontSize: '2rem', color: '#ffd700', fontFamily: 'Orbitron' }}>🏆 {winner}!</div>}
      </div>
      <CommentSection page="lucky-draw" />
    </div>
  );
}
