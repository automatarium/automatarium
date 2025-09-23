import { useEffect, useState } from 'react';

export function useRealOnlineStatus(): boolean | null {
  const [isOnline, setIsOnline] = useState<boolean | null>(null);

  useEffect(() => {
    const checkOnline = async () => {
      try {
        // Try a lightweight fetch to bypass cache and check connectivity
        const response = await fetch('/ping.txt', {
          method: 'HEAD',
          cache: 'no-store',
        });
        setIsOnline(response.ok);
      } catch {
        setIsOnline(false);
      }
    };

    checkOnline();
  }, []); // empty dependency array → runs only on initial render

  return isOnline;
}