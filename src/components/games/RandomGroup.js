import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import CommentSection from '../CommentSection';
import useTracker from '../../utils/useTracker';

export default function RandomGroup() {
  const [names, setNames] = useState('');
  const [groupCount, setGroupCount] = useState(2);
  const [groups, setGroups] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const intervalRef = useRef(null);
  const markUsed = useTracker('lottery', 'random-group');

  const colors = ['#00d4ff', '#f72585', '#7c3aed', '#00f5d4', '#fee440', '#ff6b6b', '#4ecdc4', '#a855f7'];

  const handleStart = () => {
    const nameList = names.split('\n').map(n => n.trim()).filter(n => n);
    if (nameList.length < 2) return alert('Please enter at least 2 names (one per line)');
    if (groupCount < 2) return alert('Number of groups must be at least 2');
    if (groupCount > nameList.length) return alert('Number of groups cannot exceed number of names');

    markUsed();
    setShowResult(false);
    setIsAnimating(true);

    let count = 0;
    intervalRef.current = setInterval(() => {
      const shuffled = [...nameList].sort(() => Math.random() - 0.5);
      const tempGroups = Array.from({ length: groupCount }, () => []);
      shuffled.forEach((name, i) => tempGroups[i % groupCount].push(name));
      setGroups(tempGroups);
      count++;
      if (count >= 20) {
        clearInterval(intervalRef.current);
        setIsAnimating(false);
        setShowResult(true);
      }
    }, 100);
  };

  return (
    <div className="page">
      <Link to="/lottery" className="back-btn">← Back to Lottery Tools</Link>
      <h2>👥 Random Group</h2>
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
        <div className="form-group">
          <label>Number of groups</label>
          <input
            type="number"
            min={2}
            max={20}
            value={groupCount}
            onChange={e => setGroupCount(parseInt(e.target.value) || 2)}
            style={{ width: '120px' }}
          />
        </div>
        <button className="btn" onClick={handleStart} disabled={isAnimating}>
          {isAnimating ? '🔀 Grouping...' : '🚀 Start Grouping'}
        </button>

        {groups.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(auto-fill, minmax(200px, 1fr))`,
            gap: '1rem',
            marginTop: '2rem'
          }}>
            {groups.map((group, gi) => (
              <div key={gi} style={{
                background: `${colors[gi % colors.length]}15`,
                border: `2px solid ${colors[gi % colors.length]}${showResult ? 'aa' : '44'}`,
                borderRadius: '12px',
                padding: '1rem',
                transition: 'all 0.3s',
                transform: showResult ? 'scale(1.02)' : 'scale(1)',
              }}>
                <h3 style={{
                  color: colors[gi % colors.length],
                  marginBottom: '0.8rem',
                  fontSize: '1.1rem',
                  textAlign: 'center',
                  fontFamily: 'Orbitron, sans-serif'
                }}>
                  Group {gi + 1}
                </h3>
                {group.map((name, ni) => (
                  <div key={ni} style={{
                    padding: '0.4rem 0.8rem',
                    margin: '0.3rem 0',
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: '6px',
                    color: '#e0e0e0',
                    fontSize: '1rem',
                    textAlign: 'center',
                    animation: showResult ? `fadeIn 0.3s ease ${ni * 0.1}s both` : 'none',
                  }}>
                    {name}
                  </div>
                ))}
                <div style={{
                  marginTop: '0.5rem',
                  textAlign: 'center',
                  color: '#888',
                  fontSize: '0.8rem'
                }}>
                  {group.length} member{group.length > 1 ? 's' : ''}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <CommentSection page="random-group" />
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
