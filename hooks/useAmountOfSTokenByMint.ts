import { BigNumber } from 'bignumber.js';
import { Battle, LiquidityType } from '@/types/battle';
import dayjs from 'dayjs';
import { useAccount } from 'wagmi';
import { useEffect, useMemo, useState } from 'react';
import { readContract } from '@wagmi/core';
import { Collateral } from '@/types/collateral';
import { findCorrectTick } from '@/lib/tickAndPrice';
import { config } from '@/app/providers';
import { QUOTER_ADDRESS } from '@/constants/contracts';
import { QuoterABI } from '@/constants/abis/quoter';
import { Address } from 'viem';

export const useAmountOfSTokenByMint = (
  amount: bigint,
  isSpear: boolean,
  min: string,
  max: string,
  collateral: Collateral | undefined,
  battle: Battle | undefined,
) => {
  const { address } = useAccount();
  const [finalAmount, setFinalAmount] = useState(0n);

  const minX96 = useMemo(() => new BigNumber(battle?.sqrtPriceX96.toString() ?? '0').multipliedBy(0.95), [battle]);
  const maxX96 = useMemo(() => new BigNumber(battle?.sqrtPriceX96.toString() ?? '0').multipliedBy(1.05), [battle]);

  useEffect(() => {
    if (!battle || !battle.bk) return;
    const valueLower = isSpear ? new BigNumber(1).minus(max).toFixed() : min;
    const valueUpper = isSpear ? new BigNumber(1).minus(min).toFixed() : max;
    const tickLower = findCorrectTick(valueLower) ?? 0;
    const tickUpper = findCorrectTick(valueUpper) ?? 0;
    const args = {
      battleKey: {
        expiries: battle.bk.expiries,
        collateral: battle.bk.collateral,
        underlying: battle.bk.underlying,
        strikeValue: battle.bk.strikeValue,
      },
      tickLower,
      tickUpper,
      minSqrtPriceX96: BigInt(minX96.toFixed(0)),
      maxSqrtPriceX96: BigInt(maxX96.toFixed(0)),
      liquidityType: LiquidityType.Collateral,
      recipient: address as Address,
      amount,
      deadline: BigInt((dayjs.utc(new Date()).unix() + 3600).toString()),
    };
    readContract(config, {
      address: QUOTER_ADDRESS,
      abi: QuoterABI,
      functionName: 'getSTokenByLiquidity',
      args: [args],
    }).then((r) => {
      setFinalAmount(r);
    });
  }, [min, max, amount, battle, collateral]);

  return { data: finalAmount };
};
