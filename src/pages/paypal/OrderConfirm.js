import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const planNames = {
  monthly: 'Monthly VIP Membership',
  quarterly: 'Quarterly VIP Membership',
  yearly: 'Yearly VIP Membership',
};

const planPrices = {
  monthly: '$15.00',
  quarterly: '$36.00',
  yearly: '$120.00',
};

export default function OrderConfirm() {
  const location = useLocation();
  const navigate = useNavigate();
  const { referenceId, orderId, approveLink, planType } = location.state || {};
  const [loading, setLoading] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  const [error, setError] = useState('');

  if (!referenceId) {
    return (
      <div className="page" style={{ textAlign: 'center', marginTop: '4rem' }}>
        <div className="tool-box" style={{ maxWidth: '500px', margin: '0 auto' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
          <h3 style={{ color: '#fff', marginBottom: '1rem' }}>No Order Found</h3>
          <p style={{ color: '#888', marginBottom: '1.5rem' }}>Please create an order from the Top-up page first.</p>
          <button className="btn" onClick={() => navigate('/paypal/topup')}>Go to Top-up</button>
        </div>
      </div>
    );
  }

  if (cancelled) {
    return (
      <div className="page" style={{ textAlign: 'center', marginTop: '4rem' }}>
        <div className="tool-box" style={{ maxWidth: '500px', margin: '0 auto' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>❌</div>
          <h3 style={{ color: '#f72585', marginBottom: '1rem' }}>Order Cancelled</h3>
          <p style={{ color: '#888', marginBottom: '0.5rem' }}>Reference: {referenceId}</p>
          <p style={{ color: '#888', marginBottom: '1.5rem' }}>Your order has been cancelled.</p>
          <button className="btn" onClick={() => navigate('/paypal/topup')}>Back to Top-up</button>
        </div>
      </div>
    );
  }

  const handleConfirm = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/paypal/user_confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ referenceId, action: 'confirm' }),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
        setLoading(false);
        return;
      }
      // Save referenceId for return redirect
      localStorage.setItem('lastReferenceId', referenceId);
      // Redirect to PayPal
      window.location.href = approveLink;
    } catch (e) {
      setError('Failed to confirm. Please try again.');
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    setLoading(true);
    try {
      await fetch('/api/paypal/user_confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ referenceId, action: 'cancel' }),
      });
      setCancelled(true);
    } catch (e) {
      setError('Failed to cancel.');
    }
    setLoading(false);
  };

  return (
    <div className="page">
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Confirm Your Order</h2>

        <div className="tool-box" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ color: '#fff', marginBottom: '1.2rem', fontSize: '1.1rem' }}>Order Details</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ color: '#888' }}>Plan</span>
              <span style={{ color: '#fff', fontWeight: '600' }}>{planNames[planType] || planType}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ color: '#888' }}>Amount</span>
              <span style={{ color: '#00d4ff', fontWeight: '700', fontSize: '1.2rem' }}>{planPrices[planType] || '-'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ color: '#888' }}>Payment Method</span>
              <span style={{ color: '#fff' }}>PayPal</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ color: '#888' }}>PayPal Order ID</span>
              <span style={{ color: '#fff', fontSize: '0.85rem', fontFamily: 'monospace' }}>{orderId}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0' }}>
              <span style={{ color: '#888' }}>Reference ID</span>
              <span style={{ color: '#fff', fontSize: '0.85rem', fontFamily: 'monospace' }}>{referenceId}</span>
            </div>
          </div>
        </div>

        {error && (
          <div style={{
            color: '#f72585', marginBottom: '1rem', padding: '0.8rem',
            background: 'rgba(247,37,133,0.1)', borderRadius: '8px', textAlign: 'center',
          }}>{error}</div>
        )}

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={handleCancel}
            disabled={loading}
            style={{
              flex: 1, padding: '0.9rem', border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '8px', background: 'transparent', color: '#888',
              cursor: 'pointer', fontSize: '1rem', fontWeight: '600',
              transition: 'all 0.3s',
            }}
          >
            Cancel
          </button>
          <button
            className="btn"
            onClick={handleConfirm}
            disabled={loading}
            style={{ flex: 2, padding: '0.9rem', fontSize: '1rem', opacity: loading ? 0.6 : 1 }}
          >
            {loading ? 'Processing...' : 'Confirm & Pay with PayPal'}
          </button>
        </div>
      </div>
    </div>
  );
}
