import { useState, useEffect, useMemo, useRef } from 'react';
import { formatUnits } from 'viem';
import { useQuery } from '@tanstack/react-query';

interface PriceUpdate {
  price: string;
  timestamp: number;
}

export const usePriceStream = (endpoint: string, underlying: string) => {
  const [currentPrice, setCurrentPrice] = useState<string | null>(null);
  const [realtimePrices, setRealtimePrices] = useState<PriceUpdate[]>([]);
  const [error, setError] = useState<string | null>(null);
  const lastUpdateTimeRef = useRef(0);

  const { data: historicalPrices = [] } = useQuery({
    queryKey: ['historical-prices', underlying],
    queryFn: async () => {
      return await fetch(`https://moondoom-backend.fly.dev/oneDayPrice?underlying=${underlying}`).then((r) => r.json());
    },
    enabled: !!underlying,
  });

  const combinedPriceHistory = useMemo(() => {
    if (historicalPrices && historicalPrices?.length > 0) {
      const normalizedHistorical = historicalPrices?.map((item: { publish_time: number; price: string }) => ({
        price: item.price,
        timestamp: item.publish_time * 1000,
      }));

      return [...normalizedHistorical, ...realtimePrices].sort((a, b) => a.timestamp - b.timestamp);
    }
    return realtimePrices;
  }, [historicalPrices, realtimePrices]);

  useEffect(() => {
    const eventSource = new EventSource(endpoint);

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const price = formatUnits(data?.parsed[0]?.ema_price?.price, 8);
        const now = Date.now();
        if (now - lastUpdateTimeRef.current < 10000) {
          return;
        }
        lastUpdateTimeRef.current = now;
        setCurrentPrice(price);
        setRealtimePrices((prev) => {
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
    priceHistory: combinedPriceHistory,
    error,
    isConnected: !error,
  };
};
