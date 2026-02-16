import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const statusMap = {
  1: { icon: '⏳', title: 'Order Created', desc: 'Your order has been created. Waiting for payment.', color: '#888' },
  2: { icon: '⏳', title: 'Processing...', desc: 'Your payment is being processed. This may take a moment.', color: '#ffd700' },
  3: { icon: '✅', title: 'Payment Successful!', desc: 'Your VIP membership has been activated. Thank you!', color: '#00d4ff' },
  4: { icon: '❌', title: 'Payment Failed', desc: 'Unfortunately, your payment could not be processed.', color: '#f72585' },
  5: { icon: '🚫', title: 'Order Cancelled', desc: 'This order has been cancelled.', color: '#888' },
};

export default function ResultRedirect() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState(null);
  const [orderData, setOrderData] = useState(null);
  const [pollCount, setPollCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const referenceId = searchParams.get('referenceId') || localStorage.getItem('lastReferenceId');

  const checkStatus = useCallback(async () => {
    if (!referenceId) {
      setLoading(false);
      return;
    }
    try {
      const res = await fetch('/api/paypal/order_confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ referenceId }),
      });
      const data = await res.json();
      setOrderData(data);
      setStatus(data.paymentStatus);
      setLoading(false);
      return data.paymentStatus;
    } catch (e) {
      setLoading(false);
      return null;
    }
  }, [referenceId]);

  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  // Poll if status is 1 or 2
  useEffect(() => {
    if ((status === 1 || status === 2) && pollCount < 10) {
      const timer = setTimeout(async () => {
        const newStatus = await checkStatus();
        if (newStatus === 1 || newStatus === 2) {
          setPollCount(c => c + 1);
        }
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [status, pollCount, checkStatus]);

  if (!referenceId) {
    return (
      <div className="page" style={{ textAlign: 'center', marginTop: '4rem' }}>
        <div className="tool-box" style={{ maxWidth: '500px', margin: '0 auto' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
          <h3 style={{ color: '#fff', marginBottom: '1rem' }}>No Order Reference</h3>
          <p style={{ color: '#888', marginBottom: '1.5rem' }}>Unable to find your order. Please check the Order Query page.</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button className="btn" onClick={() => navigate('/paypal/topup')}>New Order</button>
            <button className="btn" onClick={() => navigate('/paypal/query')} style={{ background: 'linear-gradient(135deg, #f72585, #7c3aed)' }}>Query Order</button>
          </div>
        </div>
      </div>
    );
  }

  const info = statusMap[status] || statusMap[2];

  return (
    <div className="page" style={{ textAlign: 'center', marginTop: '4rem' }}>
      <div className="tool-box" style={{ maxWidth: '550px', margin: '0 auto' }}>
        {loading ? (
          <>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⏳</div>
            <h3 style={{ color: '#ffd700', marginBottom: '0.5rem' }}>Processing...</h3>
            <p style={{ color: '#888' }}>Checking your payment status...</p>
          </>
        ) : (
          <>
            <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>{info.icon}</div>
            <h3 style={{ color: info.color, marginBottom: '0.5rem', fontSize: '1.4rem' }}>{info.title}</h3>
            <p style={{ color: '#888', marginBottom: '1.5rem' }}>{info.desc}</p>

            {orderData && (
              <div style={{
                textAlign: 'left', padding: '1rem', background: 'rgba(255,255,255,0.03)',
                borderRadius: '8px', marginBottom: '1.5rem',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ color: '#888', fontSize: '0.9rem' }}>Reference ID</span>
                  <span style={{ color: '#fff', fontSize: '0.85rem', fontFamily: 'monospace' }}>{orderData.referenceId}</span>
                </div>
                {orderData.orderId && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ color: '#888', fontSize: '0.9rem' }}>PayPal Order ID</span>
                    <span style={{ color: '#fff', fontSize: '0.85rem', fontFamily: 'monospace' }}>{orderData.orderId}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0' }}>
                  <span style={{ color: '#888', fontSize: '0.9rem' }}>Date</span>
                  <span style={{ color: '#fff', fontSize: '0.85rem' }}>{orderData.wdate}</span>
                </div>
              </div>
            )}

            {(status === 1 || status === 2) && pollCount < 10 && (
              <p style={{ color: '#ffd700', fontSize: '0.85rem', marginBottom: '1rem' }}>
                🔄 Checking status... ({pollCount + 1}/10)
              </p>
            )}

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button className="btn" onClick={() => navigate('/paypal/topup')}>New Order</button>
              <button className="btn" onClick={() => navigate('/paypal/query')} style={{ background: 'linear-gradient(135deg, #f72585, #7c3aed)' }}>Query Order</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
