import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const plans = [
  { key: 'monthly', name: 'Monthly', price: '$15/mo', total: '$15', amount: '15.00', badge: '' },
  { key: 'quarterly', name: 'Quarterly', price: '$12/mo', total: '$36', amount: '36.00', badge: 'SAVE 20%' },
  { key: 'yearly', name: 'Yearly', price: '$10/mo', total: '$120', amount: '120.00', badge: 'BEST VALUE' },
];

export default function TopUp() {
  const [selected, setSelected] = useState('monthly');
  const [paymentMethod, setPaymentMethod] = useState('paypal');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/paypal/create_order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planType: selected }),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
        setLoading(false);
        return;
      }
      // Navigate to confirm page with order details
      navigate('/paypal/confirm', {
        state: {
          referenceId: data.referenceId,
          orderId: data.orderId,
          approveLink: data.approveLink,
          planType: selected,
        },
      });
    } catch (e) {
      setError('Failed to create order. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💳 Member Top-up</h2>
        <div style={{
          display: 'inline-block',
          padding: '0.5rem 1.2rem',
          background: 'rgba(247, 37, 133, 0.15)',
          border: '1px solid rgba(247, 37, 133, 0.3)',
          borderRadius: '8px',
          color: '#f72585',
          fontSize: '0.85rem',
          fontWeight: '500',
        }}>
          ⚠️ This is a test page — no real charges will be made
        </div>
      </div>

      {/* Payment Method */}
      <div className="tool-box" style={{ maxWidth: '700px', margin: '0 auto 1.5rem' }}>
        <h3 style={{ color: '#fff', marginBottom: '1rem', fontSize: '1.1rem' }}>Payment Method</h3>
        <select
          value={paymentMethod}
          onChange={e => setPaymentMethod(e.target.value)}
          style={{
            width: '100%', padding: '1rem 1.2rem', borderRadius: '12px',
            background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.3)',
            color: '#fff', fontSize: '1rem', cursor: 'pointer',
            appearance: 'auto', outline: 'none',
          }}
        >
          <option value="paypal" style={{ background: '#1a1a2e', color: '#fff' }}>🅿️ PayPal (Sandbox)</option>
        </select>
      </div>

      {/* Plan Selection */}
      <div className="tool-box" style={{ maxWidth: '700px', margin: '0 auto 1.5rem' }}>
        <h3 style={{ color: '#fff', marginBottom: '1rem', fontSize: '1.1rem' }}>Select Your Plan</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          {plans.map(p => (
            <div
              key={p.key}
              onClick={() => setSelected(p.key)}
              style={{
                padding: '1.2rem 1.5rem',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.3s',
                border: selected === p.key
                  ? '2px solid #00d4ff'
                  : '2px solid rgba(255,255,255,0.08)',
                background: selected === p.key
                  ? 'rgba(0,212,255,0.08)'
                  : 'rgba(255,255,255,0.02)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                position: 'relative',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: '20px', height: '20px', borderRadius: '50%',
                  border: selected === p.key ? '6px solid #00d4ff' : '2px solid #555',
                  transition: 'all 0.3s',
                }} />
                <div>
                  <div style={{ color: '#fff', fontWeight: '600', fontSize: '1.05rem' }}>{p.name}</div>
                  <div style={{ color: '#888', fontSize: '0.85rem' }}>{p.price}</div>
                </div>
              </div>
              <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                {p.badge && (
                  <span style={{
                    background: p.key === 'yearly' ? 'linear-gradient(135deg, #f72585, #7c3aed)' : 'rgba(0,212,255,0.2)',
                    color: '#fff',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '6px',
                    fontSize: '0.7rem',
                    fontWeight: '700',
                  }}>{p.badge}</span>
                )}
                <div style={{ color: '#00d4ff', fontWeight: '700', fontSize: '1.3rem' }}>{p.total}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Submit */}
      <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
        {error && (
          <div style={{
            color: '#f72585', marginBottom: '1rem', padding: '0.8rem',
            background: 'rgba(247,37,133,0.1)', borderRadius: '8px',
          }}>{error}</div>
        )}
        <button
          className="btn"
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: '100%', padding: '1rem', fontSize: '1.1rem',
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? 'Creating Order...' : `Proceed to Payment — ${plans.find(p => p.key === selected).total}`}
        </button>
        <div style={{ marginTop: '1.2rem' }}>
          <Link to="/paypal/query" style={{ color: '#888', fontSize: '0.9rem', textDecoration: 'none' }}>
            🔍 Already have an order? <span style={{ color: '#00d4ff' }}>Query Order Status</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
