import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import useTracker from '../../utils/useTracker';
import CommentSection from '../CommentSection';

const SIZE = 20, W = 20, H = 20;

export default function SnakeGame() {
  const markUsed = useTracker('game', 'Snake Game');
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);
  const stateRef = useRef({ snake: [{x:10,y:10}], dir: {x:1,y:0}, food: {x:15,y:10}, running: false });

  const spawnFood = useCallback((snake) => {
    let f;
    do { f = { x: Math.floor(Math.random()*W), y: Math.floor(Math.random()*H) }; } while (snake.some(s => s.x===f.x && s.y===f.y));
    return f;
  }, []);

  const draw = useCallback((ctx, snake, food) => {
    ctx.fillStyle = '#0d0d20';
    ctx.fillRect(0, 0, W*SIZE, H*SIZE);
    ctx.fillStyle = '#00d4ff';
    snake.forEach((s, i) => {
      ctx.fillStyle = i === 0 ? '#ffd700' : `rgba(0,212,255,${1 - i*0.02})`;
      ctx.fillRect(s.x*SIZE+1, s.y*SIZE+1, SIZE-2, SIZE-2);
    });
    ctx.fillStyle = '#f72585';
    ctx.beginPath();
    ctx.arc(food.x*SIZE+SIZE/2, food.y*SIZE+SIZE/2, SIZE/2-2, 0, Math.PI*2);
    ctx.fill();
  }, []);

  const startGame = useCallback(() => {
    markUsed();
    const s = stateRef.current;
    s.snake = [{x:10,y:10}]; s.dir = {x:1,y:0}; s.food = spawnFood(s.snake); s.running = true;
    setScore(0); setGameOver(false); setStarted(true);
  }, [markUsed, spawnFood]);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    draw(ctx, stateRef.current.snake, stateRef.current.food);

    const handleKey = (e) => {
      const s = stateRef.current;
      const map = { ArrowUp:{x:0,y:-1}, ArrowDown:{x:0,y:1}, ArrowLeft:{x:-1,y:0}, ArrowRight:{x:1,y:0}, w:{x:0,y:-1}, s:{x:0,y:1}, a:{x:-1,y:0}, d:{x:1,y:0} };
      const d = map[e.key];
      if (d && !(d.x === -s.dir.x && d.y === -s.dir.y)) { s.dir = d; e.preventDefault(); }
    };
    window.addEventListener('keydown', handleKey);

    const interval = setInterval(() => {
      const s = stateRef.current;
      if (!s.running) return;
      const head = { x: s.snake[0].x + s.dir.x, y: s.snake[0].y + s.dir.y };
      if (head.x < 0 || head.x >= W || head.y < 0 || head.y >= H || s.snake.some(seg => seg.x === head.x && seg.y === head.y)) {
        s.running = false; setGameOver(true); return;
      }
      s.snake.unshift(head);
      if (head.x === s.food.x && head.y === s.food.y) {
        s.food = spawnFood(s.snake);
        setScore(sc => sc + 10);
      } else { s.snake.pop(); }
      draw(ctx, s.snake, s.food);
    }, 120);

    return () => { window.removeEventListener('keydown', handleKey); clearInterval(interval); };
  }, [draw, spawnFood]);

  return (
    <div className="page">
      <Link to="/games" className="back-btn">← Back</Link>
      <h2>🐍 Snake Game</h2>
      <div className="tool-box" style={{ textAlign: 'center' }}>
        <p style={{ color: '#888', marginBottom: '0.5rem' }}>Use Arrow keys or WASD</p>
        <p style={{ color: '#00d4ff', fontSize: '1.2rem', marginBottom: '1rem' }}>Score: {score}</p>
        <canvas ref={canvasRef} width={W*SIZE} height={H*SIZE} style={{ maxWidth: '100%', height: 'auto' }} />
        {(gameOver || !started) && (
          <div style={{ marginTop: '1rem' }}>
            {gameOver && <p style={{ color: '#f72585', fontSize: '1.3rem', marginBottom: '0.5rem' }}>Game Over!</p>}
            <button className="btn" onClick={startGame}>{gameOver ? 'Play Again' : 'Start Game'}</button>
          </div>
        )}
      </div>
      <CommentSection page="snake-game" />
    </div>
  );
}
