const API = '/api';

export const submitLog = (data) =>
  navigator.sendBeacon?.(`${API}/logs`, new Blob([JSON.stringify(data)], { type: 'application/json' }))
    || fetch(`${API}/logs`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data), keepalive: true });

export const getComments = () => fetch(`${API}/comments`).then(r => r.json());

export const submitComment = (data) =>
  fetch(`${API}/comments`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) }).then(r => r.json());
