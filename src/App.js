import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import LotteryTools from './pages/LotteryTools';
import Games from './pages/Games';
import Roulette from './components/lottery/Roulette';
import DiceRoller from './components/lottery/DiceRoller';
import RandomNumber from './components/lottery/RandomNumber';
import CoinFlip from './components/lottery/CoinFlip';
import LuckyDraw from './components/lottery/LuckyDraw';
import GuessNumber from './components/games/GuessNumber';
import SnakeGame from './components/games/SnakeGame';
import JigsawPuzzle from './components/games/JigsawPuzzle';
import Breakout from './components/games/Breakout';
import RandomGroup from './components/games/RandomGroup';
import RandomOrder from './components/games/RandomOrder';
import TopUp from './pages/paypal/TopUp';
import OrderConfirm from './pages/paypal/OrderConfirm';
import ResultRedirect from './pages/paypal/ResultRedirect';
import OrderQuery from './pages/paypal/OrderQuery';

function Navbar() {
  const loc = useLocation();
  const links = [
    ['/', 'Home'], ['/lottery', 'Lottery'], ['/games', 'Games'], ['/paypal/topup', 'VIP']
  ];
  return (
    <nav className="navbar">
      <Link to="/" className="logo">⚡ Entertainment Spot</Link>
      <div className="links">
        {links.map(([to, label]) => (
          <Link key={to} to={to} className={loc.pathname === to ? 'active' : ''}>{label}</Link>
        ))}
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/lottery" element={<LotteryTools />} />
        <Route path="/games" element={<Games />} />
        <Route path="/lottery/roulette" element={<Roulette />} />
        <Route path="/lottery/dice" element={<DiceRoller />} />
        <Route path="/lottery/random" element={<RandomNumber />} />
        <Route path="/lottery/coin" element={<CoinFlip />} />
        <Route path="/lottery/draw" element={<LuckyDraw />} />
        <Route path="/games/guess" element={<GuessNumber />} />
        <Route path="/games/snake" element={<SnakeGame />} />
        <Route path="/games/puzzle" element={<JigsawPuzzle />} />
        <Route path="/games/breakout" element={<Breakout />} />
        <Route path="/lottery/group" element={<RandomGroup />} />
        <Route path="/lottery/order" element={<RandomOrder />} />
        <Route path="/paypal/topup" element={<TopUp />} />
        <Route path="/paypal/confirm" element={<OrderConfirm />} />
        <Route path="/paypal/result" element={<ResultRedirect />} />
        <Route path="/paypal/query" element={<OrderQuery />} />
      </Routes>
    </>
  );
}
