import { useAccount } from 'wagmi';
import { Address, parseEther, parseUnits } from 'viem';
import { ShortPosition } from '@/types/position';
import { isShortPositionCall } from '@/lib/position';
import { useQuery } from '@apollo/client';
import { GET_USER_NFTS } from '@/graphql/nfts';

interface nftResponse {
  amountSeed: string;
  id: string;
  liquidity: string;
  liquidityType: number;
  spearObligation: string;
  shieldObligation: string;
  spearOutOwed: string;
  shieldOutOwed: string;
  status: number;
  tickLowerIdx: number;
  tickUpperIdx: number;
  collateralSeed: string;
  feeOwed: string;
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

export const useShortPositions = (): {
  shortPositions: ShortPosition[] | undefined;
  loading: boolean;
  refetch: () => void;
} => {
  const { address } = useAccount();

  // const { data, isLoading, refetch } = useReadContract({
  //   address: QUOTER_ADDRESS,
  //   abi: QuoterABI,
  //   functionName: 'accountPositions',
  //   args: [address as Address],
  // });

  const { data, loading, refetch } = useQuery(GET_USER_NFTS, {
    variables: {
      address: address?.toLowerCase(),
    },
    pollInterval: 5000,
  });

  console.log(data, loading);

  const shortPositions = data?.nfts.map((nft: nftResponse) => {
    const decimals = nft.battle.collateral.decimals;
    const battle = {
      id: nft.battle.address as Address,
      bk: {
        underlying: nft.battle.underlying.symbol,
        collateral: nft.battle.collateral.id as Address,
        expiry: BigInt(nft.battle.endTS),
        expiries: BigInt(nft.battle.endTS),
        strikeValue: parseEther(nft.battle.strikeValue),
      },
      sqrtPriceX96: BigInt(nft.battle.sqrtPriceX96),
    };
    const result = {
      tokenId: BigInt(nft.id),
      tickLower: nft.tickLowerIdx,
      tickUpper: nft.tickUpperIdx,
      liquidity: nft.liquidity,
      liquidityType: nft.liquidityType,
      state: nft.status,
      owed: {
        collateralIn: BigInt(nft.collateralSeed),
        fee: BigInt(nft.feeOwed),
        spearOut: BigInt(nft.spearOutOwed),
        shieldOut: BigInt(nft.shieldOutOwed),
      },
      seed: parseUnits(nft.amountSeed, decimals),
      spearObligation: BigInt(nft.spearObligation),
      shieldObligation: BigInt(nft.shieldObligation),
      battle,
    };
    return {
      ...result,
      isCall: isShortPositionCall({
        ...result,
        battle,
      }),
    };
  });

  return { shortPositions: shortPositions as ShortPosition[], loading, refetch };
};
