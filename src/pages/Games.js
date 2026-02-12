import React from 'react';
import { Link } from 'react-router-dom';

const games = [
  { icon: '🤔', title: 'Guess the Number', desc: 'Computer picks 1-100, can you guess?', to: '/games/guess' },
  { icon: '🐍', title: 'Snake Game', desc: 'Classic snake - eat and grow', to: '/games/snake' },
  { icon: '🧩', title: 'Jigsaw Puzzle', desc: '4x4 sliding tile puzzle', to: '/games/puzzle' },
  { icon: '🧱', title: 'Breakout', desc: 'Break bricks with a bouncing ball', to: '/games/breakout' },
];

export default function Games() {
  return (
    <div className="page">
      <Link to="/" className="back-btn">← Back</Link>
      <h2>🎮 Web Games</h2>
      <div className="grid">
        {games.map(g => (
          <Link to={g.to} key={g.title} style={{ textDecoration: 'none' }}>
            <div className="card"><div className="icon">{g.icon}</div><h3>{g.title}</h3><p>{g.desc}</p></div>
          </Link>
        ))}
      </div>
    </div>
  );
}
