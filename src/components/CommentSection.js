import React, { useState, useEffect } from 'react';

const API = process.env.REACT_APP_API || '/api';

export default function CommentSection({ page }) {
  const [comments, setComments] = useState([]);
  const [userName, setUserName] = useState('');
  const [comment, setComment] = useState('');
  const [stars, setStars] = useState(5);
  const [hoverStar, setHoverStar] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const fetchComments = () => {
    fetch(`${API}/comments?page=${encodeURIComponent(page)}`)
      .then(r => r.json())
      .then(setComments)
      .catch(() => {});
  };

  useEffect(() => { fetchComments(); }, [page]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userName.trim() || !comment.trim()) return alert('Please enter your name and comment');
    setSubmitting(true);
    try {
      await fetch(`${API}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userName: userName.trim(), comment: comment.trim(), stars, page })
      });
      setComment('');
      fetchComments();
    } catch (err) {
      alert('Submit failed, please try again');
    }
    setSubmitting(false);
  };

  const timeAgo = (dateStr) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now - d) / 1000);
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`;
    return d.toLocaleDateString('en-US');
  };

  return (
    <div style={{ marginTop: '3rem', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '2rem' }}>
      <h3 style={{
        fontFamily: 'Orbitron, sans-serif',
        fontSize: '1.3rem',
        marginBottom: '1.5rem',
        background: 'linear-gradient(90deg, #00d4ff, #7c3aed)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}>
        💬 Comments
      </h3>

      {/* Submit Form */}
      <form onSubmit={handleSubmit} style={{
        background: '#16162a',
        borderRadius: '12px',
        padding: '1.5rem',
        marginBottom: '1.5rem',
        border: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <input
            value={userName}
            onChange={e => setUserName(e.target.value)}
            placeholder="Your name"
            style={{ flex: '1', minWidth: '120px' }}
            maxLength={50}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
            {[1, 2, 3, 4, 5].map(s => (
              <span
                key={s}
                onClick={() => setStars(s)}
                onMouseEnter={() => setHoverStar(s)}
                onMouseLeave={() => setHoverStar(0)}
                style={{
                  cursor: 'pointer',
                  fontSize: '1.4rem',
                  color: s <= (hoverStar || stars) ? '#ffd700' : '#444',
                  transition: 'color 0.15s, transform 0.15s',
                  transform: s <= (hoverStar || stars) ? 'scale(1.1)' : 'scale(1)',
                }}
              >★</span>
            ))}
          </div>
        </div>
        <textarea
          value={comment}
          onChange={e => setComment(e.target.value)}
          placeholder="Write your comment..."
          rows={3}
          style={{ marginBottom: '1rem', resize: 'vertical' }}
          maxLength={500}
        />
        <button className="btn" type="submit" disabled={submitting}>
          {submitting ? 'Submitting...' : '📝 Post Comment'}
        </button>
      </form>

      {/* Comments List */}
      {comments.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#666', padding: '2rem 0' }}>
          No comments yet. Be the first! 🎉
        </div>
      ) : (
        comments.map(c => (
          <div key={c.id} className="comment-card" style={{
            animation: 'fadeIn 0.3s ease',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span className="name">{c.userName}</span>
              <span style={{ color: '#666', fontSize: '0.8rem' }}>{timeAgo(c.createdAt)}</span>
            </div>
            <div className="stars" style={{ marginBottom: '0.4rem' }}>
              {'★'.repeat(c.stars)}{'☆'.repeat(5 - c.stars)}
            </div>
            <div className="text">{c.comment}</div>
          </div>
        ))
      )}
    </div>
  );
}
