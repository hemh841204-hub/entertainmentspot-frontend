import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import useTracker from '../../utils/useTracker';
import CommentSection from '../CommentSection';

const N = 4;
const solved = Array.from({ length: N * N }, (_, i) => (i + 1) % (N * N));

function shuffle() {
  const tiles = [...solved];
  for (let i = tiles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
  }
  return tiles;
}

export default function JigsawPuzzle() {
  const markUsed = useTracker('game', 'Jigsaw Puzzle');
  const [tiles, setTiles] = useState(() => shuffle());
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);

  const blankIdx = tiles.indexOf(0);

  const canMove = useCallback((idx) => {
    const br = Math.floor(blankIdx / N), bc = blankIdx % N;
    const tr = Math.floor(idx / N), tc = idx % N;
    return (Math.abs(br - tr) + Math.abs(bc - tc)) === 1;
  }, [blankIdx]);

  const move = (idx) => {
    if (won || !canMove(idx)) return;
    markUsed();
    const newTiles = [...tiles];
    [newTiles[blankIdx], newTiles[idx]] = [newTiles[idx], newTiles[blankIdx]];
    setTiles(newTiles);
    setMoves(m => m + 1);
    if (newTiles.every((t, i) => t === solved[i])) setWon(true);
  };

  const reset = () => { setTiles(shuffle()); setMoves(0); setWon(false); };

  const colors = ['#f72585','#7c3aed','#00d4ff','#4cc9f0','#f77f00','#06d6a0','#ef476f','#118ab2','#ffd166','#073b4c','#e63946','#457b9d','#264653','#2a9d8f','#e9c46a'];

  return (
    <div className="page">
      <Link to="/games" className="back-btn">← Back</Link>
      <h2>🧩 Sliding Puzzle</h2>
      <div className="tool-box" style={{ textAlign: 'center' }}>
        <p style={{ color: '#888', marginBottom: '0.5rem' }}>Click a tile next to the blank to slide it</p>
        <p style={{ color: '#00d4ff', marginBottom: '1rem' }}>Moves: {moves}</p>
        <div style={{ display: 'inline-grid', gridTemplateColumns: `repeat(${N}, 70px)`, gap: '4px' }}>
          {tiles.map((tile, idx) => (
            <div key={idx} onClick={() => move(idx)} style={{
              width: 70, height: 70, display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: tile === 0 ? 'transparent' : colors[tile - 1],
              borderRadius: '8px', fontSize: '1.5rem', fontWeight: 700, color: '#fff',
              cursor: tile !== 0 && canMove(idx) ? 'pointer' : 'default',
              fontFamily: 'Orbitron',
              transition: 'all 0.15s',
              opacity: tile === 0 ? 0 : 1,
              border: tile !== 0 && canMove(idx) ? '2px solid rgba(255,255,255,0.3)' : '2px solid transparent'
            }}>
              {tile || ''}
            </div>
          ))}
        </div>
        {won && <p style={{ color: '#ffd700', fontSize: '1.5rem', marginTop: '1rem', fontFamily: 'Orbitron' }}>🎉 Solved in {moves} moves!</p>}
        <div style={{ marginTop: '1rem' }}>
          <button className="btn" onClick={reset}>{won ? 'Play Again' : 'Shuffle'}</button>
        </div>
      </div>
      <CommentSection page="jigsaw-puzzle" />
    </div>
  );
}
