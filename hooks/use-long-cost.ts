import { useQuery } from '@apollo/client';
import { GET_USER_TRADES } from '@/graphql/trades';
import { Address, parseUnits } from 'viem';
import { useAccount } from 'wagmi';

export const useLongCost = (battleId: Address, decimals: number) => {
  const { address } = useAccount();
  const { data } = useQuery(GET_USER_TRADES, {
    variables: {
      sender: address?.toLowerCase(),
      battle: battleId?.toLowerCase(),
    },
    pollInterval: 5000,
  });

  const trades = data?.trades;
  return (
    trades?.reduce((acc: bigint, trade: { amountIn: string }) => acc + parseUnits(trade.amountIn, decimals), 0n) ?? 0n
  );
};
