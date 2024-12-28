import { useEffect, useState } from 'react';
import { getSqrtPriceX96FromPrice } from '@divergence-protocol/diver-sdk';
import { useAccount } from 'wagmi';
import { simulateContract } from '@wagmi/core';
import { config } from '@/app/providers';
import { QUOTER_ADDRESS } from '@/constants/contracts';
import { QuoterABI } from '@/constants/abis/quoter';
import { Address, parseEther, parseUnits, toHex } from 'viem';

export const useQuote = (amount: string, battleId: Address, isSpear: boolean, type: number, decimals: number) => {
  const { address } = useAccount();
  const [get, setGet] = useState(0n);
  const [spent, setSpent] = useState(0n);
  const [loading, setLoading] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const query = async () => {
      if (parseEther(amount) > 0 && battleId) {
        setLoading(true);
        const action = isSpear ? 0 : 1;
        const sqrtX96Price = getSqrtPriceX96FromPrice(0);
        const payAmount = (type === 1 ? -1n : 1n) * parseUnits(amount, decimals);
        const args = {
          recipient: address as Address,
          tradeType: action,
          amountSpecified: payAmount,
          sqrtPriceLimitX96: BigInt(sqrtX96Price.toFixed()),
          data: toHex(''),
        };
        const result = await simulateContract(config, {
          address: QUOTER_ADDRESS,
          abi: QuoterABI,
          functionName: 'quoteExactInput',
          args: [args, battleId],
        });
        const get = result?.result?.[1];
        const spend = result?.result?.[0];
        setGet(get);
        setSpent(spend);
        setIndex(index + 1);
      } else {
        setGet(0n);
      }
      setLoading(false);
    };

    query();
  }, [amount, isSpear, type, battleId]);

  return { get, spent, loading, index };
};
