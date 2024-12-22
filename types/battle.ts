import { Address } from 'viem';

export interface Battle {
  battle: Address;
  bk: BattleKey;
  sqrtPriceX96: bigint;
}

export interface BattleKey {
  collateral: `0x${string}`;
  underlying: string;
  expiries: bigint;
  strikeValue: bigint;
}

export enum LiquidityType {
  Collateral,
  Spear,
  Shield,
}
