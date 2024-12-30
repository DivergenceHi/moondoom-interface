import { useLongCost } from '@/hooks/use-long-cost';
import { WAD } from '@/constants';
import { Address } from 'viem';

export const useLongPortfolioData = (battleId: Address, decimals: number, callAmount: bigint, putAmount: bigint) => {
  const isUp = callAmount > putAmount;
  const netAmount = isUp ? callAmount - putAmount : putAmount - callAmount;

  const cost = useLongCost(battleId, decimals);
  const maxAmount = callAmount > putAmount ? callAmount : putAmount;
  const isLoss = maxAmount < cost;
  const plAmount = isLoss ? cost - maxAmount : maxAmount - cost;
  const avgEntryPrice = netAmount > 0n ? WAD - (plAmount * WAD) / netAmount : 0n;

  const payout = cost > 0n ? (maxAmount * 10000n) / cost - 10000n : 0n;

  return {
    isUp,
    avgEntryPrice,
    netAmount,
    payout,
    cost,
    isLoss,
    plAmount,
  };
};
