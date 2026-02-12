import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <>
      <div className="hero">
        <div style={{ marginBottom: '0.8rem', fontSize: '1.6rem', fontFamily: 'Orbitron, sans-serif', fontWeight: 700, letterSpacing: '8px', color: '#00d4ff', textTransform: 'uppercase' }}>NTU-GLDP</div>
        <h1>Entertainment Spot</h1>
        <p>Your one-stop destination for fun lottery tools and classic web games. Try your luck or challenge yourself!</p>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/lottery" className="btn">🎰 Lottery Tools</Link>
          <Link to="/games" className="btn" style={{ background: 'linear-gradient(135deg, #f72585, #7c3aed)' }}>🎮 Games</Link>
        </div>
      </div>
      <div className="grid">
        {[
          { icon: '🎡', title: 'Roulette', desc: 'Spin the wheel of fortune', to: '/lottery/roulette' },
          { icon: '👥', title: 'Random Group', desc: 'Split names into random groups', to: '/lottery/group' },
          { icon: '🔀', title: 'Random Order', desc: 'Shuffle names into random order', to: '/lottery/order' },
          { icon: '🎲', title: 'Dice Roller', desc: 'Roll the dice', to: '/lottery/dice' },
          { icon: '🔢', title: 'Random Number', desc: 'Generate random numbers', to: '/lottery/random' },
          { icon: '🪙', title: 'Coin Flip', desc: 'Heads or tails?', to: '/lottery/coin' },
          { icon: '🎯', title: 'Lucky Draw', desc: 'Pick a random winner', to: '/lottery/draw' },
          { icon: '🤔', title: 'Guess Number', desc: 'Can you guess 1-100?', to: '/games/guess' },
          { icon: '🐍', title: 'Snake', desc: 'Classic snake game', to: '/games/snake' },
          { icon: '🧩', title: 'Puzzle', desc: 'Sliding tile puzzle', to: '/games/puzzle' },
          { icon: '🧱', title: 'Breakout', desc: 'Break all the bricks!', to: '/games/breakout' },
        ].map(c => (
          <Link to={c.to} key={c.title} style={{ textDecoration: 'none' }}>
            <div className="card">
              <div className="icon">{c.icon}</div>
              <h3>{c.title}</h3>
              <p>{c.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
