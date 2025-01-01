import clsx from 'clsx';
import { Address, erc20Abi, formatUnits } from 'viem';
import { formatBalance } from '@/lib/format';
import { useAccount, useReadContracts, useWriteContract } from 'wagmi';
import { useState } from 'react';
import { COLLATERALS } from '@/constants/collaterals';
import { Loading } from '@/components/loading';
import { PositionState, ShortPosition } from '@/types/position';
import { POSITION_MANAGER_ADDRESS } from '@/constants/contracts';
import { PositionManagerAbi } from '@/constants/abis/position-manager';
import { waitForTransactionReceipt } from '@wagmi/core';
import { config } from '@/app/providers';
import { ExpectedPayout } from '@/components/expected-payout';

export const CloseShort = ({ position, refetch }: { position: ShortPosition; refetch: () => void }) => {
  const { address } = useAccount();
  const [finalizeLoading, setFinalizeLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const battle = position.battle;
  const currentCollateral = COLLATERALS?.find(
    (c) => c.address.toLowerCase() === position?.battle?.bk?.collateral?.toLowerCase(),
  );
  // const collateralSymbol = currentCollateral?.name;
  const decimals = currentCollateral?.decimals ?? 18;
  // const shieldPrice = getPriceFromSqrtPriceX96(battle.battle_info.sqrt_price_x96);
  const callAmount = position?.owed?.spearOut;
  const putAmount = position?.owed?.shieldOut;
  const isUp = callAmount > putAmount;
  const maxAmount = isUp ? callAmount : putAmount;

  const { data, refetch: refetchBalance } = useReadContracts({
    contracts: [
      {
        abi: erc20Abi,
        address: battle?.battle_info.spear,
        functionName: 'balanceOf',
        args: [address as Address],
      },
      {
        abi: erc20Abi,
        address: battle?.battle_info.shield,
        functionName: 'balanceOf',
        args: [address as Address],
      },
      {
        abi: erc20Abi,
        address: battle?.battle_info?.spear,
        functionName: 'allowance',
        args: [address as Address, POSITION_MANAGER_ADDRESS],
      },
      {
        abi: erc20Abi,
        address: battle?.battle_info?.shield,
        functionName: 'allowance',
        args: [address as Address, POSITION_MANAGER_ADDRESS],
      },
    ],
  });

  const spearBalance = data?.[0]?.result ?? 0n;
  const shieldBalance = data?.[1]?.result ?? 0n;
  const spearAllowance = data?.[2]?.result ?? 0n;
  const shiledAllowance = data?.[3]?.result ?? 0n;
  const balance = isUp ? spearBalance : shieldBalance;

  const burnAmount = isUp ? callAmount : putAmount;
  const finalized = position?.state > PositionState.LiquidityAdded;
  const receiveAmount = finalized
    ? burnAmount
    : position?.seed + position?.owed?.collateralIn + position?.owed?.fee - maxAmount;
  const { writeContractAsync } = useWriteContract();

  const onFinalize = async () => {
    setFinalizeLoading(true);
    try {
      const hash = await writeContractAsync?.({
        address: POSITION_MANAGER_ADDRESS,
        abi: PositionManagerAbi,
        functionName: 'removeLiquidity',
        args: [position.tokenId],
      });
      await waitForTransactionReceipt(config, { hash });
      refetch?.();
    } catch (e) {
      console.error(e);
    }
    setFinalizeLoading(false);
  };

  const onClose = async () => {
    setLoading(true);
    try {
      const hash = await writeContractAsync?.({
        address: POSITION_MANAGER_ADDRESS,
        abi: PositionManagerAbi,
        functionName: 'redeemObligation',
        args: [position.tokenId],
      });
      await waitForTransactionReceipt(config, { hash });
      refetch?.();
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const onApprove = async () => {
    setLoading(true);
    try {
      const hash = await writeContractAsync?.({
        address: (isUp ? battle?.battle_info?.spear : battle?.battle_info?.shield) as Address,
        abi: erc20Abi,
        functionName: 'approve',
        args: [POSITION_MANAGER_ADDRESS, burnAmount],
      });
      await waitForTransactionReceipt(config, { hash });
      refetch?.();
      refetchBalance?.();
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const needApprove = isUp ? spearAllowance < burnAmount : shiledAllowance < burnAmount;

  return (
    <div className={'relative'}>
      <div className={'font-chela text-4xl text-center pt-4 mb-4'}>Close Short</div>
      <ExpectedPayout payout={154n} />

      <div className={'mt-4 flex justify-between'}>
        Burn
        {finalized && <div>Balance: {formatBalance(balance, decimals, decimals)}</div>}
      </div>
      {finalized ? (
        <div className={'input-md-wrapper'}>
          <input type="text" placeholder={'0.0'} value={formatBalance(burnAmount, decimals, decimals)} readOnly />
          <div className="ml-auto font-semibold text-sm">{isUp ? 'UP' : 'DOWN'}</div>
        </div>
      ) : (
        <div className={'input-md-wrapper'}>
          <input type="text" placeholder={'0.0'} value={'1'} readOnly />
          <div className="ml-auto font-semibold text-sm">LP</div>
        </div>
      )}

      <div className={'flex justify-between items-center mt-2'}>Receive</div>
      <div className={'input-md-wrapper'}>
        <input type="text" placeholder={'0.0'} value={formatBalance(receiveAmount, decimals, decimals)} readOnly />
        <div className="flex ml-auto text-sm font-semibold">USDC</div>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6">
        <button
          className={clsx('btn-md-primary')}
          disabled={finalizeLoading || position?.state > PositionState.LiquidityAdded}
          onClick={onFinalize}
        >
          {finalizeLoading && <Loading />}
          Finalize
        </button>
        <button
          className={clsx('btn-md-primary')}
          disabled={loading || position?.state !== PositionState.LiquidityRemoved}
          onClick={needApprove ? onApprove : onClose}
        >
          {loading && <Loading />}
          {needApprove ? 'Approve' : 'Close'}
        </button>
      </div>

      <div className="mt-4 text-sm">
        <div className="flex justify-between mt-6">
          <div>Avg. entry price</div>
          <div>${formatBalance(0n, 18, 4)}</div>
        </div>
        <div className="flex justify-between">
          <div>Total cost</div>
          <div>${formatBalance(0n, decimals, 4)}</div>
        </div>
        <div className="flex justify-between font-bold">
          <div className={'font-bold'}>Expected P/L</div>
          <div className={'text-dark-primary'}>+${formatUnits(BigInt(0n), decimals)}</div>
        </div>
      </div>
    </div>
  );
};
