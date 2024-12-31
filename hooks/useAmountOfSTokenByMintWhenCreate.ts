import { BigNumber } from 'bignumber.js';
import { useReadContract } from 'wagmi';
import { Collateral } from '@/types/collateral';
import { findCorrectTick } from '@/lib/tickAndPrice';
import { getSqrtPriceX96FromMin } from '@/lib/battle';
import { QUOTER_ADDRESS } from '@/constants/contracts';
import { QuoterABI } from '@/constants/abis/quoter';
import { parseUnits } from 'viem';
import { useEffect, useState } from 'react';
import { readContract } from '@wagmi/core';
import { config } from '@/app/providers';

export const useAmountOfSTokenByMintWhenCreate = (
  amount: string,
  isSpear: boolean,
  min: string,
  max: string,
  collateral: Collateral | undefined,
) => {
  const [finalAmount, setFinalAmount] = useState(0n);

  useEffect(() => {
    const x96 = getSqrtPriceX96FromMin(isSpear, min);
    const valueLower = isSpear ? new BigNumber(1).minus(max).toFixed() : min;
    const valueUpper = isSpear ? new BigNumber(1).minus(min).toFixed() : max;
    const lower = findCorrectTick(valueLower) ?? 0;
    const upper = findCorrectTick(valueUpper) ?? 0;

    readContract(config, {
      address: QUOTER_ADDRESS,
      abi: QuoterABI,
      functionName: 'getSTokenByLiquidityWhenCreate',
      args: [BigInt(x96), lower ?? 0, upper ?? 0, parseUnits(amount, collateral?.decimals ?? 18)],
    }).then((r) => {
      setFinalAmount(r);
    });
  }, [amount, isSpear, min, max, collateral]);

  return { data: finalAmount };
};
