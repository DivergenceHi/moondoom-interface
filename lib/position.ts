import { LiquidityType } from '@/types/battle';
import { getSqrtPriceX96FromTick } from '@divergence-protocol/diver-sdk';

export const isShortPositionCall = (
  position:
    | {
        liquidityType: LiquidityType;
        owed: {
          spearOut: bigint;
          shieldOut: bigint;
        };
        tickLower: number;
        battle: {
          sqrtPriceX96: bigint;
        };
      }
    | undefined,
): boolean => {
  if (!position) return true;

  let isCall = false;
  if (position.liquidityType === LiquidityType.Spear) {
    isCall = true;
  }
  if (position.liquidityType === LiquidityType.Collateral) {
    if (position.owed.spearOut > position.owed.shieldOut) isCall = true;
    if (position.owed.spearOut === position.owed.shieldOut) {
      const x96 = BigInt(getSqrtPriceX96FromTick(position.tickLower).toFixed(0));
      if (x96 > BigInt(position?.battle?.sqrtPriceX96 ?? '0')) isCall = true;
    }
  }

  return isCall;
};
