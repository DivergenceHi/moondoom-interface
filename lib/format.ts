import { formatUnits, parseUnits } from 'viem';

export const formatBalance = (
  value: bigint | undefined,
  decimals: number = 18,
  displayDecimals: number = 4,
): string => {
  if (!value) return '0';

  try {
    const formattedValue = formatUnits(value, decimals);

    const [whole, fraction = ''] = formattedValue.split('.');
    const truncatedFraction = fraction.slice(0, displayDecimals);

    const cleanFraction = truncatedFraction.replace(/0+$/, '');

    return cleanFraction ? `${whole}.${cleanFraction}` : whole;
  } catch (error) {
    console.error('Error formatting balance:', error);
    return '0';
  }
};

export const formatBalanceWithCommas = (
  value: bigint | undefined,
  decimals: number = 18,
  displayDecimals: number = 4,
): string => {
  const formatted = formatBalance(value, decimals, displayDecimals);
  const [whole, fraction] = formatted.split('.');

  const withCommas = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return fraction ? `${withCommas}.${fraction}` : withCommas;
};

export const toBigInt = (value: string | number, decimals: number = 18): bigint => {
  try {
    return parseUnits(value.toString(), decimals);
  } catch {
    return 0n;
  }
};

export const formatUSD = (value: string | number): string => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  const isNegative = num < 0;
  const absNum = Math.abs(num);
  const formatted = absNum.toFixed(2);

  return isNegative ? `-$${formatted}` : `$${formatted}`;
};

// const balance = 123456789n;
// console.log(formatBalance(balance, 6));  // "123.456789"
// console.log(formatBalanceWithCommas(balance, 6));  // "123.456789"
// console.log(formatBalance(balance, 6, 2));  // "123.45"
