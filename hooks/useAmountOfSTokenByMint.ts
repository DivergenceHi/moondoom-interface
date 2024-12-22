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
import { parseUnits } from 'viem';

export const useAmountOfSTokenByMint = (
  amount: string,
  isSpear: boolean,
  min: string,
  max: string,
  collateral: Collateral,
  battle: Battle | undefined,
) => {
  const { address } = useAccount();
  const [finalAmount, setFinalAmount] = useState(0n);
  const input = parseUnits(amount, collateral.decimals);

  const lowerValue = useMemo(() => (isSpear ? new BigNumber(1).minus(max).toFixed() : min), [isSpear, max, min]);
  const upperValue = useMemo(() => (isSpear ? new BigNumber(1).minus(min).toFixed() : max), [isSpear, max, min]);
  const lower = useMemo(() => findCorrectTick(lowerValue), [lowerValue]);
  const upper = useMemo(() => findCorrectTick(upperValue), [upperValue]);
  const minX96 = useMemo(() => new BigNumber(battle?.sqrtPriceX96.toString() ?? '0').multipliedBy(0.95), [battle]);
  const maxX96 = useMemo(() => new BigNumber(battle?.sqrtPriceX96.toString() ?? '0').multipliedBy(1.05), [battle]);
  const mintArgs = useMemo(
    () => ({
      battleKey: {
        collateral: battle?.bk.collateral,
        expiries: battle?.bk.expiries,
        underlying: battle?.bk.underlying,
        strikeValue: battle?.bk.strikeValue,
      },
      tickLower: lower,
      tickUpper: upper,
      minSqrtPriceX96: BigInt(minX96.toFixed(0)),
      maxSqrtPriceX96: BigInt(maxX96.toFixed(0)),
      liquidityType: LiquidityType.Collateral,
      recipient: address,
      amount: input,
      deadline: BigInt((dayjs.utc(new Date()).unix() + 3600).toString()),
    }),
    [collateral, battle, min, max, amount],
  );

  useEffect(() => {
    if (!!min && !!max && !!amount && !!battle && !!collateral && mintArgs) {
      readContract(config, {
        address: QUOTER_ADDRESS,
        abi: QuoterABI,
        functionName: 'getSTokenByLiquidity',
        args: [mintArgs],
      }).then((r) => {
        setFinalAmount(r);
      });
    } else {
      setFinalAmount(0n);
    }
  }, [mintArgs]);

  return { data: finalAmount };
};
