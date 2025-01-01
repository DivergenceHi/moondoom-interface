import clsx from 'clsx';
import { formatUnits } from 'viem';
import { formatBalance } from '@/lib/format';
import { COLLATERALS } from '@/constants/collaterals';
import { Loading } from '@/components/loading';
import { PositionState, ShortPosition } from '@/types/position';
import { POSITION_MANAGER_ADDRESS } from '@/constants/contracts';
import { ExpectedPayout } from '@/components/expected-payout';
import { useApprove } from '@/hooks/use-approve';
import { useRedeemObligation } from '@/hooks/use-redeem-obligation';
import { useRemoveLiquidity } from '@/hooks/use-remove-liquidity';
import { useBalances } from '@/hooks/use-balances';
import { getPriceFromSqrtPriceX96 } from '@divergence-protocol/diver-sdk';
import { WAD } from '@/constants';

export const CloseShort = ({ position, refetch }: { position: ShortPosition; refetch: () => void }) => {
  const battle = position.battle;
  const currentCollateral = COLLATERALS?.find(
    (c) => c.address.toLowerCase() === position?.battle?.bk?.collateral?.toLowerCase(),
  );
  const shieldPrice = BigInt(
    getPriceFromSqrtPriceX96(position?.battle?.battle_info?.sqrt_price_x96 ?? '0')
      .multipliedBy(WAD.toString())
      .toFixed(0),
  );
  const spearPrice = WAD - shieldPrice;

  const decimals = currentCollateral?.decimals ?? 18;
  const callAmount = position?.owed?.spearOut;
  const putAmount = position?.owed?.shieldOut;
  const isUp = callAmount > putAmount;
  const maxAmount = isUp ? callAmount : putAmount;
  const minAmount = isUp ? putAmount : callAmount;

  const { data, refetch: refetchBalance } = useBalances(battle);

  const spearBalance = data?.[1]?.result ?? 0n;
  const shieldBalance = data?.[2]?.result ?? 0n;
  const spearAllowance = data?.[4]?.result ?? 0n;
  const shieldAllowance = data?.[5]?.result ?? 0n;
  const balance = isUp ? spearBalance : shieldBalance;

  const burnAmount = isUp ? callAmount : putAmount;
  const finalized = position?.state > PositionState.LiquidityAdded;
  const receiveAmount = finalized
    ? burnAmount
    : position?.seed + position?.owed?.collateralIn + position?.owed?.fee - maxAmount;
  const obligation = isUp ? callAmount - putAmount : putAmount - callAmount;
  const cost = (burnAmount * (isUp ? spearPrice : shieldPrice)) / WAD;

  const plExpiryAmount = position?.seed + position?.owed?.collateralIn + position?.owed?.fee - minAmount;
  const plNowAmount = obligation - cost;

  const payout = position?.seed > 0n ? (10000n * (finalized ? plNowAmount : plExpiryAmount)) / position?.seed : 0n;

  const { removeLiquidity, removing } = useRemoveLiquidity(position?.tokenId, refetch);
  const { redeemObligation, redeeming } = useRedeemObligation(position?.tokenId);
  const { approve, approving } = useApprove(
    isUp ? battle?.battle_info?.spear : battle?.battle_info?.shield,
    POSITION_MANAGER_ADDRESS,
    burnAmount,
    () => {
      refetch?.();
      refetchBalance?.();
    },
  );

  const needApprove = isUp ? spearAllowance < burnAmount : shieldAllowance < burnAmount;

  return (
    <div className={'relative'}>
      <div className={'font-chela text-4xl text-center pt-4 mb-4'}>Close Short</div>
      <ExpectedPayout payout={payout} />
      <div className={'mt-2 flex justify-between'}>
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
          <input type="text" value={'1'} readOnly />
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
          disabled={removing || position?.state > PositionState.LiquidityAdded}
          onClick={removeLiquidity}
        >
          {removing && <Loading />}
          Finalize
        </button>
        <button
          className={clsx('btn-md-primary')}
          disabled={redeeming || approving || position?.state !== PositionState.LiquidityRemoved}
          onClick={needApprove ? approve : redeemObligation}
        >
          {(redeeming || approving) && <Loading />}
          {needApprove ? 'Approve' : 'Close'}
        </button>
      </div>

      <div className="mt-4 text-sm">
        {finalized ? (
          <>
            <div className="flex justify-between">
              <div>To be Claimed at Expiry</div>
              <div>${formatBalance(obligation, decimals, 4)}</div>
            </div>
            <div className="flex justify-between">
              <div>Cost to Claim Now</div>
              <div>${formatBalance(cost, decimals, 4)}</div>
            </div>
            <div className="flex justify-between font-bold">
              <div className={'font-bold'}>Expected P/L Now</div>
              <div className={'text-dark-primary'}>+${formatBalance(plNowAmount, decimals, 4)}</div>
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-between">
              <div>To be Claimed at Expiry</div>
              <div>${formatBalance(obligation, decimals, 4)}</div>
            </div>
            <div className="flex justify-between font-bold">
              <div className={'font-bold'}>Expected P/L at Expiry</div>
              <div className={'text-dark-primary'}>+${formatBalance(plExpiryAmount, decimals, 4)}</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
