import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import useTracker from '../../utils/useTracker';
import CommentSection from '../CommentSection';

export default function Roulette() {
  const markUsed = useTracker('lottery', 'Roulette');
  const [items, setItems] = useState(['Pizza', 'Burger', 'Sushi', 'Tacos', 'Pasta', 'Salad']);
  const [newItem, setNewItem] = useState('');
  const [rotation, setRotation] = useState(0);
  const [winner, setWinner] = useState('');
  const [spinning, setSpinning] = useState(false);
  const wheelRef = useRef(null);

  const addItem = () => { if (newItem.trim() && items.length < 12) { setItems([...items, newItem.trim()]); setNewItem(''); } };
  const removeItem = (i) => setItems(items.filter((_, idx) => idx !== i));

  const spin = () => {
    if (spinning || items.length < 2) return;
    markUsed();
    setSpinning(true);
    setWinner('');
    const extra = 1440 + Math.random() * 1440;
    const newRot = rotation + extra;
    setRotation(newRot);
    setTimeout(() => {
      const deg = newRot % 360;
      const sliceAngle = 360 / items.length;
      const idx = Math.floor((360 - deg) / sliceAngle) % items.length;
      setWinner(items[idx]);
      setSpinning(false);
    }, 4000);
  };

  const colors = ['#f72585','#7c3aed','#00d4ff','#4cc9f0','#f77f00','#06d6a0','#ef476f','#118ab2','#ffd166','#073b4c','#e63946','#457b9d'];

  return (
    <div className="page">
      <Link to="/lottery" className="back-btn">← Back</Link>
      <h2>🎡 Roulette</h2>
      <div className="tool-box" style={{ textAlign: 'center' }}>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <input style={{ width: '200px' }} value={newItem} onChange={e => setNewItem(e.target.value)} placeholder="Add item" onKeyDown={e => e.key === 'Enter' && addItem()} />
          <button className="btn" onClick={addItem}>Add</button>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '1rem' }}>
          {items.map((item, i) => (
            <span key={i} style={{ background: colors[i % colors.length], padding: '4px 12px', borderRadius: '20px', fontSize: '0.85rem', cursor: 'pointer', color: '#fff' }} onClick={() => removeItem(i)}>
              {item} ✕
            </span>
          ))}
        </div>
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <div className="roulette-pointer">▼</div>
          <svg ref={wheelRef} width="300" height="300" viewBox="0 0 300 300" style={{ transform: `rotate(${rotation}deg)`, transition: spinning ? 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none' }}>
            {items.map((item, i) => {
              const angle = 360 / items.length;
              const startAngle = i * angle - 90;
              const endAngle = startAngle + angle;
              const sr = (startAngle * Math.PI) / 180;
              const er = (endAngle * Math.PI) / 180;
              const x1 = 150 + 145 * Math.cos(sr);
              const y1 = 150 + 145 * Math.sin(sr);
              const x2 = 150 + 145 * Math.cos(er);
              const y2 = 150 + 145 * Math.sin(er);
              const large = angle > 180 ? 1 : 0;
              const midAngle = ((startAngle + endAngle) / 2 * Math.PI) / 180;
              const tx = 150 + 90 * Math.cos(midAngle);
              const ty = 150 + 90 * Math.sin(midAngle);
              return (
                <g key={i}>
                  <path d={`M150,150 L${x1},${y1} A145,145 0 ${large},1 ${x2},${y2} Z`} fill={colors[i % colors.length]} stroke="#0a0a1a" strokeWidth="2" />
                  <text x={tx} y={ty} fill="#fff" fontSize="11" fontWeight="600" textAnchor="middle" dominantBaseline="middle" transform={`rotate(${(startAngle + endAngle) / 2}, ${tx}, ${ty})`}>
                    {item.length > 8 ? item.slice(0, 8) + '…' : item}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
        <div style={{ marginTop: '1.5rem' }}>
          <button className="btn" onClick={spin} disabled={spinning || items.length < 2}>
            {spinning ? 'Spinning...' : '🎰 SPIN!'}
          </button>
        </div>
        {winner && <div style={{ marginTop: '1.5rem', fontSize: '1.5rem', color: '#ffd700', fontFamily: 'Orbitron' }}>🎉 Winner: {winner}</div>}
      </div>
      <CommentSection page="roulette" />
    </div>
  );
}
