import clsx from 'clsx';
import { formatBalance } from '@/lib/format';
import { useAccount, useReadContracts, useWriteContract } from 'wagmi';
import { useAmountOfSTokenByMint } from '@/hooks/useAmountOfSTokenByMint';
import { Address, erc20Abi, parseEther, parseUnits } from 'viem';
import { findCorrectTick } from '@/lib/tickAndPrice';
import dayjs from 'dayjs';
import { Battle, LiquidityType } from '@/types/battle';
import { TradeAbi } from '@/constants/abis/trade';
import { POSITION_MANAGER_ADDRESS } from '@/constants/contracts';
import { base } from 'viem/chains';
import { waitForTransactionReceipt } from '@wagmi/core';
import { config } from '@/app/providers';
import { useState } from 'react';
import { getPriceFromSqrtPriceX96 } from '@divergence-protocol/diver-sdk';
import { COLLATERALS } from '@/constants/collaterals';
import { BigNumber } from 'bignumber.js';
import { Loading } from '@/components/loading';
import { sleep } from '@/lib';

export const ShortCard = ({
  battle,
  refetch,
  setIndex,
}: {
  battle: Battle | undefined;
  refetch: () => void;
  setIndex: (index: number) => void;
}) => {
  const [loading, setLoading] = useState(false);
  const { address } = useAccount();
  const [amount, setAmount] = useState('');
  const [mode, setMode] = useState<number>(-1); // 0 => up, 1 => down, 2 => dual
  const { writeContractAsync } = useWriteContract();

  const sqrtX96 = battle?.sqrtPriceX96.toString() ?? '0';
  const shieldPrice = getPriceFromSqrtPriceX96(sqrtX96);
  const spearPrice = new BigNumber(1).minus(shieldPrice);

  const currentCollateral = COLLATERALS.find((c) => c.name === 'USDC');
  const decimals = currentCollateral?.decimals ?? 18;
  const min = mode === 2 ? '0.01' : shieldPrice?.toFixed();
  const max = '0.99';

  const { data: canGet } = useAmountOfSTokenByMint(
    parseUnits(amount, decimals),
    true,
    min,
    max,
    currentCollateral,
    battle,
  );

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

  const confirm = async () => {
    if (!battle || !battle?.bk) return;
    setLoading(true);
    try {
      const valueLower = mode === 0 ? new BigNumber(1).minus(max).toFixed() : min;
      const valueUpper = mode === 0 ? new BigNumber(1).minus(min).toFixed() : max;
      const tickLower = findCorrectTick(valueLower) ?? 0;
      const tickUpper = findCorrectTick(valueUpper) ?? 0;
      const x96 = BigInt(sqrtX96);

      const minSqrtPriceX96 = (x96 * 95n) / 100n;
      const maxSqrtPriceX96 = (x96 * 105n) / 100n;
      console.log(tickLower, tickUpper, minSqrtPriceX96, maxSqrtPriceX96);
      const deadline = BigInt(dayjs.utc(new Date()).unix() + 3600);

      const args = {
        battleKey: {
          expiries: battle.bk.expiry,
          collateral: battle.bk.collateral,
          underlying: battle.bk.underlying,
          strikeValue: battle.bk.strikeValue,
        },
        tickLower,
        tickUpper,
        minSqrtPriceX96,
        maxSqrtPriceX96,
        liquidityType: LiquidityType.Collateral,
        recipient: address as Address,
        amount: parseUnits(amount, decimals),
        deadline,
      };
      const hash = await writeContractAsync({
        abi: TradeAbi,
        address: POSITION_MANAGER_ADDRESS,
        functionName: 'addLiquidity',
        args: [args],
        chain: base,
        account: address,
      });
      await waitForTransactionReceipt(config, { hash });
      await sleep(2000);
      refetch?.();
      refetchBalance?.();
      setIndex(1);
    } catch (e) {
      console.error(e);
    }

    setLoading(false);
  };

  const can = parseEther(amount) > 0n;

  const needApprove = allowance < parseUnits(amount, decimals);

  return (
    <div className={''}>
      <button
        className={clsx('short-range-item', {
          'bg-md-gradient-primary active': mode === 0,
        })}
        onClick={() => setMode(0)}
      >
        <div>Short Up</div>
        <div>{spearPrice.toFixed(2)} - 0.99</div>
      </button>
      <button
        className={clsx('short-range-item', {
          'bg-md-gradient-primary active': mode === 1,
        })}
        onClick={() => setMode(1)}
      >
        <div>Short Down</div>
        <div>{shieldPrice.toFixed(2)} - 0.99</div>
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
      <div className={'input-md-wrapper'}>
        <input type="text" placeholder={'0.0'} value={amount} onChange={(e) => setAmount(e.target.value)} />
        <div className="text-symbol ml-auto">USDC</div>
      </div>

      <div className={'mt-2'}>Short</div>
      <div className={'input-md-wrapper'}>
        <input type="text" placeholder={'0.0'} value={formatBalance(canGet, decimals, decimals)} disabled readOnly />
        <div className="text-symbol ml-auto">{mode === 0 ? 'UP' : mode === 1 ? 'DOWN' : ''}</div>
      </div>

      <button
        className={'btn-md-primary drop-md-shadow mt-6'}
        onClick={needApprove ? onApprove : confirm}
        disabled={!can || mode === -1 || loading}
      >
        {loading && <Loading />}
        {needApprove ? 'Approve' : 'Add'}
      </button>
    </div>
  );
};
