import { BattleResponseData, LiquidityType } from '@/types/battle';

export interface Owed {
  collateralIn: bigint;
  fee: bigint;
  spearOut: bigint;
  shieldOut: bigint;
}

export enum PositionState {
  LiquidityAdded,
  LiquidityRemoved,
  ObligationWithdrawn,
  ObligationRedeemed,
}

export interface ShortPosition {
  tokenId: bigint;
  battle?: BattleResponseData;
  tickLower: number;
  tickUpper: number;
  liquidity: bigint;
  liquidityType: LiquidityType;
  state: PositionState;
  owed: Owed;
  seed: bigint;
  spearObligation: bigint;
  shieldObligation: bigint;
}
