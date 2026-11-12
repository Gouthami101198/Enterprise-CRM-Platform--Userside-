import { useEffect } from 'react';

export const useTitleTicker = (
  title = 'Vanguard CRM Platform',
  speed = 200,
  separator = '   - '
) => {
  useEffect(() => {
    const fullText = `${title.trim()}${separator}`;
    let charIndex = 0;

    const interval = window.setInterval(() => {
      charIndex = (charIndex + 1) % fullText.length;
      document.title = fullText.slice(charIndex) + fullText.slice(0, charIndex);
    }, speed);

    return () => {
      window.clearInterval(interval);
      document.title = title;
    };
  }, [title, speed, separator]);
};

