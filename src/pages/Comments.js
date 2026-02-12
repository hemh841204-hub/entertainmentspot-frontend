import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getComments, submitComment } from '../utils/api';

function Stars({ count }) {
  return <div className="stars">{'★'.repeat(count)}{'☆'.repeat(5 - count)}</div>;
}

export default function Comments() {
  const [comments, setComments] = useState([]);
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [stars, setStars] = useState(5);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { getComments().then(setComments).catch(() => {}); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !text.trim()) return;
    setSubmitting(true);
    try {
      const c = await submitComment({ userName: name, comment: text, stars });
      setComments([c, ...comments]);
      setName(''); setText(''); setStars(5);
    } catch (err) { alert('Failed to submit'); }
    setSubmitting(false);
  };

  return (
    <div className="page">
      <Link to="/" className="back-btn">← Back</Link>
      <h2>💬 Comments</h2>
      <div className="tool-box" style={{ marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1rem', color: '#fff' }}>Leave a Comment</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Your Name</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Enter your name" required />
          </div>
          <div className="form-group">
            <label>Comment</label>
            <textarea rows="3" value={text} onChange={e => setText(e.target.value)} placeholder="What would you like to say?" required />
          </div>
          <div className="form-group">
            <label>Rating</label>
            <div className="stars-input">
              {[1,2,3,4,5].map(i => (
                <span key={i} onClick={() => setStars(i)} style={{ color: i <= stars ? '#ffd700' : '#555' }}>★</span>
              ))}
            </div>
          </div>
          <button className="btn" type="submit" disabled={submitting}>{submitting ? 'Submitting...' : 'Submit'}</button>
        </form>
      </div>
      {comments.length === 0 ? <p style={{ color: '#666' }}>No comments yet. Be the first!</p> :
        comments.map(c => (
          <div className="comment-card" key={c.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="name">{c.userName}</span>
              <Stars count={c.stars} />
            </div>
            <p className="text">{c.comment}</p>
            <small style={{ color: '#555' }}>{c.submitDate} {c.submitTime}</small>
          </div>
        ))
      }
    </div>
  );
}
