import { BattleResponseData, PriceData } from '@/types/battle';

export function ellipseAddress(address: string | null | undefined, width = 6): string {
  if (!address) {
    return '';
  }

  if (width === -1) {
    return address;
  }

  return `${address.slice(0, width)}...${address.slice(-width)}`;
}

export const calculatePriceChange = (oldPrice: string, newPrice: string) => {
  const oldValue = Number(oldPrice);
  const newValue = Number(newPrice);

  const percentageChange = ((newValue - oldValue) / oldValue) * 100;

  return {
    change: percentageChange.toFixed(2),
    isPositive: percentageChange > 0,
    isNegative: percentageChange < 0,
    formatted: `${percentageChange >= 0 ? '+' : ''}${percentageChange.toFixed(2)}%`,
  };
};

const normalizeValue = (value: number, minValue: number, maxValue: number): number => {
  if (minValue === maxValue) return 4;
  const normalized = 1 + ((value - minValue) / (maxValue - minValue)) * 7;
  return Math.max(1, Math.min(8, Math.round(normalized)));
};

export const calculateSevenDayChanges = (priceHistory: PriceData[], currentPrice: string) => {
  const changes = priceHistory.map((day) => {
    const priceChange = calculatePriceChange(day.price, currentPrice);

    return {
      date: day.date_utc,
      originalPrice: day.price,
      priceChange,
      changeValue: Math.abs(Number(priceChange.change)),
    };
  });

  const changeValues = changes.map((c) => c.changeValue);
  const maxChange = Math.max(...changeValues);
  const minChange = Math.min(...changeValues);

  return changes
    .map((change) => ({
      date: change.date,
      originalPrice: change.originalPrice,
      priceChange: change.priceChange,
      normalizedValue: normalizeValue(change.changeValue, minChange, maxChange),
    }))
    .slice(0, 7)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};
