import React from 'react';
import { Link } from 'react-router-dom';

const tools = [
  { icon: '🎡', title: 'Roulette', desc: 'Spin the wheel with custom options', to: '/lottery/roulette' },
  { icon: '👥', title: 'Random Group', desc: 'Split names into random groups', to: '/lottery/group' },
  { icon: '🔀', title: 'Random Order', desc: 'Shuffle names into random order', to: '/lottery/order' },
  { icon: '🎲', title: 'Dice Roller', desc: 'Roll 1-6 dice with animation', to: '/lottery/dice' },
  { icon: '🔢', title: 'Random Number', desc: 'Generate numbers in any range', to: '/lottery/random' },
  { icon: '🪙', title: 'Coin Flip', desc: 'Flip a coin - heads or tails', to: '/lottery/coin' },
  { icon: '🎯', title: 'Lucky Draw', desc: 'Enter names and pick a winner', to: '/lottery/draw' },
];

export default function LotteryTools() {
  return (
    <div className="page">
      <Link to="/" className="back-btn">← Back</Link>
      <h2>🎰 Lottery Tools</h2>
      <div className="grid">
        {tools.map(t => (
          <Link to={t.to} key={t.title} style={{ textDecoration: 'none' }}>
            <div className="card"><div className="icon">{t.icon}</div><h3>{t.title}</h3><p>{t.desc}</p></div>
          </Link>
        ))}
      </div>
    </div>
  );
}
