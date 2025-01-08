'use client';

import clsx from 'clsx';
import { formatBalance } from '@/lib/format';
import { useAccount, useReadContracts, useWriteContract } from 'wagmi';
import { Address, encodeFunctionData, erc20Abi, parseEther, parseUnits } from 'viem';
import { findCorrectTick } from '@/lib/tickAndPrice';
import dayjs from 'dayjs';
import { LiquidityType } from '@/types/battle';
import { POSITION_MANAGER_ADDRESS } from '@/constants/contracts';
import { waitForTransactionReceipt } from '@wagmi/core';
import { config } from '@/app/providers';
import { useState } from 'react';
import { COLLATERALS } from '@/constants/collaterals';
import { BigNumber } from 'bignumber.js';
import { Loading } from '@/components/loading';
import { sleep } from '@/lib';
import { getSqrtPriceX96FromMin } from '@/lib/battle';
import { PositionManagerAbi } from '@/constants/abis/position-manager';
import { useAmountOfSTokenByMintWhenCreate } from '@/hooks/useAmountOfSTokenByMintWhenCreate';
import { getNextUTC8 } from '@/lib/date';

export const NewShortCard = ({
  underlying,
  collateral,
  strikeValue,
}: {
  underlying: string;
  collateral: Address;
  strikeValue: bigint;
}) => {
  const [loading, setLoading] = useState(false);
  const { address } = useAccount();
  const [amount, setAmount] = useState('');
  const [mode, setMode] = useState<number>(-1); // 0 => up, 1 => down, 2 => dual
  const { writeContractAsync } = useWriteContract();

  const currentCollateral = COLLATERALS.find((c) => c.name === 'USDC');
  const decimals = currentCollateral?.decimals ?? 18;
  const min = mode === 2 ? '0.5' : '0.5';
  const max = '0.99';

  const { data, refetch: refetchBalance } = useReadContracts({
    contracts: [
      {
        abi: erc20Abi,
        address: currentCollateral?.address,
        functionName: 'balanceOf',
        args: [address as Address],
      },
      {
        abi: erc20Abi,
        address: currentCollateral?.address,
        functionName: 'allowance',
        args: [address as Address, POSITION_MANAGER_ADDRESS],
      },
    ],
  });

  const allowance = data?.[1]?.result ?? 0n;

  const onApprove = async () => {
    setLoading(true);
    try {
      const hash = await writeContractAsync?.({
        address: currentCollateral?.address as Address,
        abi: erc20Abi,
        functionName: 'approve',
        args: [POSITION_MANAGER_ADDRESS, parseUnits(amount, decimals)],
      });
      await waitForTransactionReceipt(config, { hash });
      refetchBalance?.();
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const balance = data?.[0]?.result ?? 0n;
  const x96 = getSqrtPriceX96FromMin(mode === 0, min);

  const confirm = async () => {
    setLoading(true);
    try {
      const valueLower = mode === 0 ? new BigNumber(1).minus(max).toFixed() : min;
      const valueUpper = mode === 0 ? new BigNumber(1).minus(min).toFixed() : max;
      const tickLower = findCorrectTick(valueLower) ?? 0;
      const tickUpper = findCorrectTick(valueUpper) ?? 0;

      const minSqrtPriceX96 = (BigInt(x96) * 95n) / 100n;
      const maxSqrtPriceX96 = (BigInt(x96) * 105n) / 100n;
      console.log(tickLower, tickUpper, minSqrtPriceX96, maxSqrtPriceX96);
      const deadline = BigInt(dayjs.utc(new Date()).unix() + 3600);
      const battleKey = {
        underlying,
        collateral,
        expiries: BigInt(getNextUTC8().unix()),
        strikeValue,
      };
      const createArgs = {
        bk: battleKey,
        sqrtPriceX96: BigInt(x96),
      };
      const mintArgs = {
        battleKey,
        tickLower,
        tickUpper,
        minSqrtPriceX96,
        maxSqrtPriceX96,
        liquidityType: LiquidityType.Collateral,
        recipient: address as Address,
        amount: parseUnits(amount, decimals),
        deadline,
      };
      const createCalldata = encodeFunctionData({
        abi: PositionManagerAbi,
        functionName: 'createAndInitializeBattle',
        args: [createArgs],
      });
      const mintCalldata = encodeFunctionData({
        abi: PositionManagerAbi,
        functionName: 'addLiquidity',
        args: [mintArgs],
      });

      const hash = await writeContractAsync({
        abi: PositionManagerAbi,
        address: POSITION_MANAGER_ADDRESS,
        functionName: 'multicall',
        args: [[createCalldata, mintCalldata]],
      });
      await waitForTransactionReceipt(config, { hash });
      await sleep(2000);
    } catch (e) {
      console.error(e);
    }

    setLoading(false);
  };

  const can = parseEther(amount) > 0n;
  const { data: canGetWhenCreate } = useAmountOfSTokenByMintWhenCreate(amount, mode === 0, min, max, currentCollateral);
  const needApprove = allowance < parseUnits(amount, decimals);

  return (
    <div className={'pt-12'}>
      <button
        className={clsx('short-range-item', {
          'bg-md-gradient-primary active': mode === 0,
        })}
        onClick={() => setMode(0)}
      >
        <div>Short Up</div>
        <div>0.5 - 0.99</div>
      </button>
      <button
        className={clsx('short-range-item', {
          'bg-md-gradient-primary active': mode === 1,
        })}
        onClick={() => setMode(1)}
      >
        <div>Short Down</div>
        <div>0.5 - 0.99</div>
      </button>
      <button
        className={clsx('short-range-item', {
          'bg-md-gradient-primary active': mode === 2,
        })}
        onClick={() => setMode(2)}
      >
        <div>Dual Liquidity</div>
        <div>0.01 - 0.99</div>
      </button>

      <div className={'mt-4 flex-between'}>
        Deposit
        <div>Balance: {formatBalance(balance, decimals)}</div>
      </div>
      <div className={'border-2 border-black rounded-lg px-3 py-2 flex items-center text-xl'}>
        <input
          type="text"
          placeholder={'0.0'}
          className={'bg-transparent outline-none appearance-none text-lg w-full'}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <div className="text-symbol ml-auto">USDC</div>
      </div>

      <div className={'mt-4'}>Short</div>
      <div className={'border-2 border-black rounded-lg px-3 py-2 flex items-center text-xl'}>
        <input
          type="text"
          placeholder={'0.0'}
          className={'bg-transparent outline-none appearance-none text-lg w-full'}
          value={formatBalance(canGetWhenCreate, decimals, decimals)}
          disabled
          readOnly
        />
        <div className="text-symbol ml-auto">{mode === 0 ? 'UP' : mode === 1 ? 'DOWN' : ''}</div>
      </div>

      <button
        className={'btn-md-primary mt-6'}
        onClick={needApprove ? onApprove : confirm}
        disabled={!can || mode === -1 || loading}
      >
        {loading && <Loading />}
        {needApprove ? 'Approve' : 'Add'}
      </button>
    </div>
  );
};
