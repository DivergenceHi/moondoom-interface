import clsx from 'clsx';
import { Address, formatUnits, parseUnits } from 'viem';
import { ArrowDownIcon, ArrowLeftIcon } from '@radix-ui/react-icons';
import { formatBalance, formatUSD } from '@/lib/format';
import { useAccount, useWriteContract } from 'wagmi';
import { useState } from 'react';
import { useBattles } from '@/hooks/useBattles';
import { useQuote } from '@/hooks/useQuote';
import { BigNumber } from 'bignumber.js';
import { getSqrtPriceX96FromPrice } from '@divergence-protocol/diver-sdk';
import dayjs from 'dayjs';
import { POSITION_MANAGER_ADDRESS } from '@/constants/contracts';
import { TradeAbi } from '@/constants/abis/trade';
import { base } from 'viem/chains';
import { waitForTransactionReceipt } from '@wagmi/core';
import { config } from '@/app/providers';
import { TradeMode } from '@/types/trade';
import { Loading } from '@/components/loading';
import { WAD } from '@/constants';
import { useLongPortfolioData } from '@/hooks/use-long-portfolio-data';
import { ExpectedPayout } from '@/components/expected-payout';
import { useBalances } from '@/hooks/use-balances';
import { useApprove } from '@/hooks/use-approve';

export const CloseLong = ({
  battleId,
  setMode,
  callAmount,
  putAmount,
  decimals,
}: {
  battleId: Address;
  setMode: (mode: number) => void;
  callAmount: bigint;
  putAmount: bigint;
  decimals: number;
}) => {
  const [loading, setLoading] = useState(false);

  const { isUp, avgEntryPrice, netAmount } = useLongPortfolioData(battleId, decimals, callAmount, putAmount);
  const { address } = useAccount();
  const longAmount = formatBalance(netAmount, decimals, 18);
  const { battles } = useBattles();
  const battle = battles?.find((battle) => battle.id === battleId);

  const { data, refetch } = useBalances(battle);
  const balance = data?.[0]?.result ?? 0n;
  const allowance = data?.[3]?.result ?? 0n;

  const { get, spent } = useQuote(longAmount, battleId, !isUp, TradeMode.EXACT_OUTPUT, decimals);

  const tolerance = 10;
  const { writeContractAsync } = useWriteContract();

  const { approve, approving } = useApprove(battle?.bk?.collateral, POSITION_MANAGER_ADDRESS, spent, refetch);

  const onMarket = async () => {
    setLoading(true);
    if (!battle) return;
    try {
      const min = new BigNumber(get.toString())
        .times(100 - tolerance)
        .dividedBy(100)
        .toFixed(0, BigNumber.ROUND_UP);

      const args = {
        battleKey: { ...battle.bk },
        tradeType: !isUp ? 0 : 1,
        amountSpecified: spent,
        recipient: address as Address,
        amountOutMin: BigInt(min),
        sqrtPriceLimitX96: BigInt(getSqrtPriceX96FromPrice(0).toFixed()),
        deadline: BigInt(dayjs().add(300, 'second').unix()),
      };
      const hash = await writeContractAsync?.({
        address: POSITION_MANAGER_ADDRESS,
        abi: TradeAbi,
        functionName: 'trade',
        args: [args],
        chain: base,
        account: address,
      });
      await waitForTransactionReceipt(config, { hash });
      setMode(1);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const avgClosePrice = get > 0n ? WAD - (WAD * spent) / get : 0n;
  const plAmount = (avgClosePrice - avgEntryPrice) * netAmount;
  const can = parseUnits(longAmount, decimals) > 0n && get > 0n;
  const needApprove = spent > allowance;

  return (
    <div className={'relative'}>
      <ArrowLeftIcon className={'absolute cursor-pointer'} width={26} height={26} onClick={() => setMode(1)} />
      <div className={'font-chela text-4xl text-center pt-4 mb-4'}>Close Long</div>
      <ExpectedPayout payout={200n} />

      <div className={'mt-4 flex justify-between'}>Long</div>
      <div className={'input-md-wrapper'}>
        <input type="text" placeholder={'0.0'} value={longAmount} readOnly />
        <div className="ml-auto font-semibold text-sm">{!isUp ? 'UP' : 'DOWN'}</div>
      </div>

      <div className="flex justify-center mt-2">
        <ArrowDownIcon className={'font-bold w-[28px] h-[28px]'} />
      </div>
      <div className={'flex justify-between items-center'}>
        Pay
        <div>Balance: {formatUnits(balance, decimals)}</div>
      </div>
      <div className={'input-md-wrapper'}>
        <input type="text" placeholder={'0.0'} value={formatUnits(BigInt(spent), decimals)} disabled readOnly />
        <div className="flex ml-auto text-sm font-semibold">USDC</div>
      </div>

      <button
        className={clsx('btn-md-primary mt-4')}
        disabled={!can || loading || approving}
        onClick={needApprove ? approve : onMarket}
      >
        {(loading || approving) && <Loading />}
        {needApprove ? 'Approve' : 'Confirm'}
      </button>

      <div className={'mt-6 text-sm'}>
        <div className="flex justify-between mt-6">
          <div>Avg. Close Price</div>
          <div>${formatBalance(avgClosePrice, 18, 2)}</div>
        </div>
        <div className="flex justify-between">
          <div>Prior Entry Price</div>
          <div>{formatUSD(formatBalance(avgEntryPrice, 18, 2))}</div>
        </div>
        <div className="flex justify-between items-center font-bold">
          <div>Expected P/L</div>
          <div className={'text-dark-primary'}>
            +$({formatBalance(avgClosePrice, 18, 2)} - {formatBalance(avgEntryPrice, 18, 2)})*
            {formatBalance(netAmount, decimals, 2)} = ${formatBalance(plAmount, 18 + decimals, 2)}
          </div>
        </div>
      </div>
    </div>
  );
};
