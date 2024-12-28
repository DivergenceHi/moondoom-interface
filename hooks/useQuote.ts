import { useEffect, useState } from 'react';
import { BigNumber } from 'bignumber.js';
import { getSqrtPriceX96FromPrice } from '@divergence-protocol/diver-sdk';
import { ethers } from 'ethers';
import { useAccount } from 'wagmi';
import { simulateContract } from '@wagmi/core';
import { config } from '@/app/providers';
import { QUOTER_ADDRESS } from '@/constants/contracts';
import { QuoterABI } from '@/constants/abis/quoter';

export const useQuote = (
  inputAmount: string,
  battleId: string | undefined,
  isSpear: boolean,
  type: number,
  decimals?: number,
) => {
  const { address } = useAccount();
  const [get, setGet] = useState('');
  const [spent, setSpent] = useState('');
  const [odd, setOdd] = useState('');
  const [loading, setLoading] = useState(false);
  const [index, setIndex] = useState(0);
  const [fee, setFee] = useState('');

  useEffect(() => {
    const query = async () => {
      if (new BigNumber(inputAmount).gt(0) && battleId) {
        setLoading(true);
        const action = isSpear ? 0 : 1;
        const sqrtX96Price = getSqrtPriceX96FromPrice(0);
        const payAmount = ethers.utils
          .parseUnits(type === 1 ? '-' + inputAmount : inputAmount, !!decimals ? decimals : 18)
          .toString();
        const args = {
          recipient: address,
          tradeType: action,
          amountSpecified: payAmount,
          sqrtPriceLimitX96: sqrtX96Price.toFixed(),
          data: ethers.utils.formatBytes32String(''),
        };
        const result = await simulateContract(config, {
          address: QUOTER_ADDRESS,
          abi: QuoterABI,
          functionName: 'quoteExactInput',
          args: [args, battleId],
        });
        // @ts-expect-error should be fixed in the future
        const get = new BigNumber(result?.result?.[1].toString());
        // @ts-expect-error should be fixed in the future
        const spend = new BigNumber(result?.result?.[0].toString());
        setGet(get?.toFixed());
        setSpent(spend?.toFixed());
        setIndex(index + 1);
        setFee(new BigNumber(get).multipliedBy(0.003).toFixed());
        if (get.eq(0)) {
          setOdd('0');
        } else {
          setOdd(new BigNumber(1).div(spend?.div(get) ?? '1').toFixed(2));
        }
      } else {
        setOdd('0');
        setGet('0');
      }
      setLoading(false);
    };

    query();
  }, [inputAmount, isSpear, type, battleId]);

  return { get, odd, spent, fee, loading, index };
};
