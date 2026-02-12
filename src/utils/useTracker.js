import { useEffect, useRef, useCallback } from 'react';

const API = '/api';

function sendLog(data) {
  const json = JSON.stringify(data);
  // sendBeacon is most reliable for page unload scenarios
  if (navigator.sendBeacon) {
    const blob = new Blob([json], { type: 'application/json' });
    const sent = navigator.sendBeacon(`${API}/logs`, blob);
    if (sent) return;
  }
  // Fallback: fetch with keepalive
  try {
    fetch(`${API}/logs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: json,
      keepalive: true,
    }).catch(() => {});
  } catch (e) {}
}

export default function useTracker(themeType, subThemeType) {
  const used = useRef(false);
  const start = useRef(new Date());
  const submitted = useRef(false);

  const markUsed = useCallback(() => { used.current = true; }, []);

  const doSubmit = useCallback(() => {
    if (submitted.current) return; // prevent double submit
    submitted.current = true;
    const end = new Date();
    const s = start.current;
    sendLog({
      startDate: s.toISOString().slice(0, 10),
      startTime: s.toTimeString().slice(0, 8),
      endDate: end.toISOString().slice(0, 10),
      endTime: end.toTimeString().slice(0, 8),
      themeType,
      subThemeType,
      used: used.current ? 'yes' : 'no',
    });
  }, [themeType, subThemeType]);

  useEffect(() => {
    start.current = new Date();
    submitted.current = false;

    // Handle page refresh / close / navigate away
    const onBeforeUnload = () => doSubmit();
    const onPageHide = () => doSubmit();
    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden') doSubmit();
    };

    window.addEventListener('beforeunload', onBeforeUnload);
    window.addEventListener('pagehide', onPageHide);
    document.addEventListener('visibilitychange', onVisibilityChange);

    // Handle SPA navigation (React unmount)
    return () => {
      window.removeEventListener('beforeunload', onBeforeUnload);
      window.removeEventListener('pagehide', onPageHide);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      doSubmit();
    };
  }, [doSubmit]);

  return markUsed;
}
