import { Address } from 'viem';

export const ARENA_ADDRESS = '0x26da4Fef5aAc96C8861fF8EbE13d97b13dC70C89';
export const POSITION_MANAGER_ADDRESS = '0xaE41Bd18F6042396C4324FE5DE791d52e92491Dd';
export const QUOTER_ADDRESS = '0xA5a6cceC0C54DdFc346C6c0F3A5e65a7165b90f2';

export const USDT = '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9';
export const USDC = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';

export const defaultBattleKey = {
  collateral: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' as Address,
  underlying: 'BTC',
  expiries: 1736640000n,
  strikeValue: 95300875941190000000000n,
};
