import React, { useState } from 'react';

const statusLabels = {
  1: { text: 'Order Created', color: '#888' },
  2: { text: 'Processing', color: '#ffd700' },
  3: { text: 'Payment Successful', color: '#00d4ff' },
  4: { text: 'Payment Failed', color: '#f72585' },
  5: { text: 'Cancelled', color: '#888' },
};

const subtypeLabels = {
  100001: 'Monthly VIP',
  100002: 'Quarterly VIP',
  100003: 'Yearly VIP',
};

export default function OrderQuery() {
  const [queryId, setQueryId] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleQuery = async () => {
    if (!queryId.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await fetch(`/api/paypal/order_query?referenceId=${encodeURIComponent(queryId.trim())}`);
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setResult(data);
      }
    } catch (e) {
      setError('Failed to query order. Please try again.');
    }
    setLoading(false);
  };

  const statusInfo = result ? statusLabels[result.paymentStatus] || { text: 'Unknown', color: '#888' } : null;

  return (
    <div className="page">
      <div style={{ maxWidth: '650px', margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>🔍 Order Query</h2>

        <div className="tool-box" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ color: '#fff', marginBottom: '1rem', fontSize: '1.1rem' }}>Search Order</h3>
          <div style={{ display: 'flex', gap: '0.8rem' }}>
            <input
              type="text"
              placeholder="Enter Reference ID"
              value={queryId}
              onChange={e => setQueryId(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleQuery()}
              style={{ flex: 1 }}
            />
            <button className="btn" onClick={handleQuery} disabled={loading} style={{ whiteSpace: 'nowrap' }}>
              {loading ? '...' : 'Search'}
            </button>
          </div>
        </div>

        {error && (
          <div style={{
            color: '#f72585', padding: '0.8rem', marginBottom: '1rem',
            background: 'rgba(247,37,133,0.1)', borderRadius: '8px', textAlign: 'center',
          }}>{error}</div>
        )}

        {result && (
          <div className="tool-box">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.2rem' }}>
              <h3 style={{ color: '#fff', fontSize: '1.1rem' }}>Order Details</h3>
              <span style={{
                padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600',
                color: statusInfo.color,
                background: `${statusInfo.color}15`,
                border: `1px solid ${statusInfo.color}40`,
              }}>{statusInfo.text}</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {[
                ['Reference ID', result.referenceId, true],
                ['PayPal Order ID', result.orderId, true],
                ['Plan', subtypeLabels[result.transactionSubtype] || result.transactionSubtype],
                ['Payment Method', result.paymentType === 1 ? 'PayPal' : result.paymentType],
                ['User ID', result.userId, true],
                ['Created', `${result.wdate} ${result.wtime || ''}`],
                ['Last Updated', result.lstdate || '-'],
              ].map(([label, value, mono]) => (
                <div key={label} style={{
                  display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0',
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                }}>
                  <span style={{ color: '#888', fontSize: '0.9rem' }}>{label}</span>
                  <span style={{
                    color: '#fff', fontSize: '0.85rem',
                    fontFamily: mono ? 'monospace' : 'inherit',
                    maxWidth: '60%', textAlign: 'right', wordBreak: 'break-all',
                  }}>{value || '-'}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
