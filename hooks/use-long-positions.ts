'use client';
import { GET_USER_TRADERS } from '@/graphql/traders';
import { useAccount } from 'wagmi';
import { useQuery } from '@apollo/client';
import { LongPosition } from '@/types/position';
import { Address, parseEther, parseUnits } from 'viem';
import { WAD } from '@/constants';

interface traderResponse {
  spearAmount: string;
  shieldAmount: string;
  battle: {
    address: string;
    underlying: {
      symbol: string;
    };
    collateral: {
      id: string;
      decimals: number;
    };
    endTS: string;
    strikeValue: string;
    sqrtPriceX96: string;
    trades: {
      amountIn: string;
      amountOut: string;
      tradeType: number;
    }[];
  };
}

export const useLongPositions = (): { longPositions: LongPosition[] | undefined; loading: boolean } => {
  const { address } = useAccount();
  const { data, loading } = useQuery(GET_USER_TRADERS, {
    variables: {
      address: address?.toLowerCase(),
    },
    pollInterval: 5000,
  });

  const longPositions: LongPosition[] = data?.traders?.reduce((acc: LongPosition[], trader: traderResponse) => {
    const bk = {
      underlying: trader.battle.underlying.symbol,
      collateral: trader.battle.collateral.id as Address,
      expiry: BigInt(trader.battle.endTS),
      strikeValue: parseEther(trader.battle.strikeValue),
    };
    const sqrtPriceX96 = BigInt(trader.battle.sqrtPriceX96);
    const battle = {
      id: trader.battle.address as Address,
      bk,
      sqrtPriceX96,
    };
    const decimals = trader.battle.collateral.decimals;
    if (parseEther(trader.spearAmount) > 0n) {
      const cost = trader.battle.trades.reduce((acc: bigint, trade) => {
        if (trade.tradeType === 0) {
          return acc + parseUnits(trade.amountIn, decimals);
        }
        return acc;
      }, 0n);
      const amount = parseUnits(trader.spearAmount, decimals);
      acc.push({
        battle,
        isCall: true,
        amount,
        cost,
        entryPrice: (cost * WAD) / amount,
      });
    }

    if (parseEther(trader.shieldAmount) > 0n) {
      const cost = trader.battle.trades.reduce((acc: bigint, trade) => {
        if (trade.tradeType === 1) {
          return acc + parseUnits(trade.amountIn, decimals);
        }
        return acc;
      }, 0n);
      const amount = parseUnits(trader.shieldAmount, decimals);
      acc.push({
        battle,
        isCall: false,
        amount,
        cost,
        entryPrice: (cost * WAD) / amount,
      });
    }
    return acc;
  }, []);

  return { longPositions, loading };
};
