import { useEffect, useState } from 'react';

export function useRealOnlineStatus(): boolean | null {
  const [isOnline, setIsOnline] = useState<boolean | null>(null);

  useEffect(() => {
    const checkOnline = async () => {
      try {
        // Fetch to check connectivity
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
  }, []);

  return isOnline;
}