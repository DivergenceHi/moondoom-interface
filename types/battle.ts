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

export interface PriceData {
  date_utc: string;
  price: string;
  publish_time: number;
}

export interface BattleResponseData {
  category?: string; // mooner, doomer, trending
  bk?: BattleKey;
  battle_info: {
    battle: Address;
    bk: {
      collateral: Address;
      underlying: string;
      expiries: string;
      strike_value: string;
    };
    sqrt_price_x96: string;
    tick: string;
    start_ts: string;
    end_ts: string;
    spear: Address;
    shield: Address;
    result: string;
  };
  current_price: string;
  past_7days: PriceData[];
}

export interface BattleResponse {
  mooner: BattleResponseData[];
  doomer: BattleResponseData[];
  trending: BattleResponseData[];
}
