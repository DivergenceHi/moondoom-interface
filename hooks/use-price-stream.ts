import { useState, useEffect } from 'react';
import { formatUnits } from 'viem';

interface PriceUpdate {
  price: string;
  timestamp: number;
}

export const usePriceStream = (endpoint: string) => {
  const [currentPrice, setCurrentPrice] = useState<string | null>(null);
  const [priceHistory, setPriceHistory] = useState<PriceUpdate[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const eventSource = new EventSource(endpoint);

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const price = formatUnits(data?.parsed[0]?.ema_price?.price, 8);
        setCurrentPrice(price);
        setPriceHistory((prev) => {
          const newHistory = [
            ...prev,
            {
              price: price,
              timestamp: Date.now(),
            },
          ];
          return newHistory.slice(-1000);
        });
      } catch (e) {
        console.error(e);
      }
    };

    eventSource.onerror = () => {
      setError('Connection error');
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [endpoint]);

  return {
    currentPrice,
    priceHistory,
    error,
    isConnected: !error,
  };
};
