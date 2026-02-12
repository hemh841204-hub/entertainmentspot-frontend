import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import useTracker from '../../utils/useTracker';
import CommentSection from '../CommentSection';

const CW = 480, CH = 400, ROWS = 5, COLS = 8, BW = 54, BH = 18, PAD_W = 80, PAD_H = 12, BR = 6;

export default function Breakout() {
  const markUsed = useTracker('game', 'Breakout');
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const stateRef = useRef(null);

  const initState = () => {
    const bricks = [];
    const colors = ['#f72585','#7c3aed','#00d4ff','#06d6a0','#ffd700'];
    for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) bricks.push({ x: c*(BW+4)+20, y: r*(BH+4)+40, w: BW, h: BH, alive: true, color: colors[r] });
    return { ball: { x: CW/2, y: CH-50, dx: 3, dy: -3, r: BR }, pad: { x: CW/2-PAD_W/2, w: PAD_W }, bricks, mouseX: CW/2, running: true, score: 0, lives: 3 };
  };

  const start = () => {
    markUsed();
    stateRef.current = initState();
    setScore(0); setLives(3); setGameOver(false); setWon(false);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    const onMouse = (e) => {
      const rect = canvas.getBoundingClientRect();
      if (stateRef.current) stateRef.current.mouseX = e.clientX - rect.left;
    };
    canvas.addEventListener('mousemove', onMouse);

    const loop = setInterval(() => {
      const s = stateRef.current;
      if (!s || !s.running) {
        ctx.fillStyle = '#0d0d20'; ctx.fillRect(0, 0, CW, CH);
        ctx.fillStyle = '#888'; ctx.font = '16px Inter'; ctx.textAlign = 'center';
        ctx.fillText('Click Start to play!', CW/2, CH/2);
        return;
      }
      // Move paddle
      s.pad.x = Math.max(0, Math.min(CW - s.pad.w, s.mouseX - s.pad.w / 2));
      // Move ball
      const b = s.ball;
      b.x += b.dx; b.y += b.dy;
      if (b.x - b.r < 0 || b.x + b.r > CW) b.dx = -b.dx;
      if (b.y - b.r < 0) b.dy = -b.dy;
      // Paddle collision
      if (b.dy > 0 && b.y + b.r >= CH - 30 && b.x >= s.pad.x && b.x <= s.pad.x + s.pad.w) {
        b.dy = -Math.abs(b.dy);
        b.dx = ((b.x - (s.pad.x + s.pad.w/2)) / (s.pad.w/2)) * 4;
      }
      // Bottom
      if (b.y + b.r > CH) {
        s.lives--;
        setLives(s.lives);
        if (s.lives <= 0) { s.running = false; setGameOver(true); }
        else { b.x = CW/2; b.y = CH-50; b.dx = 3; b.dy = -3; }
      }
      // Brick collision
      s.bricks.forEach(brick => {
        if (!brick.alive) return;
        if (b.x + b.r > brick.x && b.x - b.r < brick.x + brick.w && b.y + b.r > brick.y && b.y - b.r < brick.y + brick.h) {
          brick.alive = false;
          b.dy = -b.dy;
          s.score += 10;
          setScore(s.score);
        }
      });
      // Win check
      if (s.bricks.every(br => !br.alive)) { s.running = false; setWon(true); }

      // Draw
      ctx.fillStyle = '#0d0d20'; ctx.fillRect(0, 0, CW, CH);
      // Bricks
      s.bricks.forEach(brick => {
        if (!brick.alive) return;
        ctx.fillStyle = brick.color;
        ctx.beginPath(); ctx.roundRect(brick.x, brick.y, brick.w, brick.h, 4); ctx.fill();
      });
      // Paddle
      const grad = ctx.createLinearGradient(s.pad.x, 0, s.pad.x + s.pad.w, 0);
      grad.addColorStop(0, '#00d4ff'); grad.addColorStop(1, '#7c3aed');
      ctx.fillStyle = grad;
      ctx.beginPath(); ctx.roundRect(s.pad.x, CH-30, s.pad.w, PAD_H, 6); ctx.fill();
      // Ball
      ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      ctx.beginPath(); ctx.arc(b.x, b.y, b.r+4, 0, Math.PI*2); ctx.fill();
    }, 16);

    return () => { canvas.removeEventListener('mousemove', onMouse); clearInterval(loop); };
  }, []);

  return (
    <div className="page">
      <Link to="/games" className="back-btn">← Back</Link>
      <h2>🧱 Breakout</h2>
      <div className="tool-box" style={{ textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '0.5rem' }}>
          <span style={{ color: '#00d4ff' }}>Score: {score}</span>
          <span style={{ color: '#f72585' }}>Lives: {'❤️'.repeat(lives)}</span>
        </div>
        <canvas ref={canvasRef} width={CW} height={CH} />
        {(gameOver || won || !stateRef.current?.running) && (
          <div style={{ marginTop: '1rem' }}>
            {gameOver && <p style={{ color: '#f72585', fontSize: '1.3rem' }}>Game Over!</p>}
            {won && <p style={{ color: '#ffd700', fontSize: '1.3rem', fontFamily: 'Orbitron' }}>🎉 You Win!</p>}
            <button className="btn" onClick={start}>{gameOver || won ? 'Play Again' : 'Start Game'}</button>
          </div>
        )}
        <p style={{ color: '#555', marginTop: '0.5rem', fontSize: '0.85rem' }}>Move mouse to control the paddle</p>
      </div>
      <CommentSection page="breakout" />
    </div>
  );
}
