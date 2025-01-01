import clsx from 'clsx';
import Image from 'next/image';
import { Address, formatUnits, parseUnits } from 'viem';
import { ArrowDownIcon, ArrowLeftIcon } from '@radix-ui/react-icons';
import { formatBalance } from '@/lib/format';
import { useAccount, useWriteContract } from 'wagmi';
import { useState } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { COLLATERALS } from '@/constants/collaterals';
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
import { ExpectedPayout } from '@/components/expected-payout';
import { useBalances } from '@/hooks/use-balances';
import { useApprove } from '@/hooks/use-approve';

export const LongCard = ({ setMode, owned }: { setMode: (mode: number) => void; owned: boolean }) => {
  const { address } = useAccount();
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState('');
  const [isUp, setIsUp] = useState(false);
  const debounceAmount = useDebounce(amount, 1000);
  const currentCollateral = COLLATERALS.find((c) => c.name === 'USDC');
  const decimals = currentCollateral?.decimals ?? 18;
  const { battles } = useBattles();

  const battle = battles?.[0];
  const { data, refetch } = useBalances(battle);

  const balance = data?.[0]?.result ?? 0n;
  const allowance = data?.[3]?.result ?? 0n;

  const tolerance = 10;
  const { get, spent } = useQuote(debounceAmount, battle?.battle_info.battle, isUp, TradeMode.EXACT_INPUT, decimals);

  const { writeContractAsync } = useWriteContract();

  const onMarket = async () => {
    setLoading(true);
    try {
      const min = new BigNumber(get.toString())
        .times(100 - tolerance)
        .dividedBy(100)
        .toFixed(0, BigNumber.ROUND_UP);

      const args = {
        battleKey: battle.bk,
        tradeType: isUp ? 0 : 1,
        amountSpecified: parseUnits(amount, decimals),
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
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const { approve, approving } = useApprove(
    currentCollateral?.address,
    POSITION_MANAGER_ADDRESS,
    parseUnits(amount, decimals),
    refetch,
  );

  const price = get > 0n ? (spent * 10n ** 18n) / get : 0n;
  const plAmount = get - spent;

  const can = parseUnits(amount, decimals) > 0n && get > 0n;
  const needApprove = parseUnits(amount, decimals) > allowance;
  const payout = spent > 0n && get > 0n ? (get * 10000n) / spent - 10000n : 0n;

  return (
    <div className={'relative'}>
      {owned && (
        <ArrowLeftIcon
          className={'absolute cursor-pointer -left-2 -top-4'}
          width={26}
          height={26}
          onClick={() => setMode(1)}
        />
      )}
      <div className={'flex'}>
        <div
          onClick={() => setIsUp(true)}
          className={clsx('cursor-pointer grayscale', {
            'grayscale-0': isUp,
          })}
        >
          <Image src={'/up.png'} alt={'up'} width={186} height={96} />
        </div>
        <div
          onClick={() => setIsUp(false)}
          className={clsx('cursor-pointer grayscale', {
            'grayscale-0': !isUp,
          })}
        >
          <Image src={'/down.png'} alt={'up'} width={186} height={125} />
        </div>
      </div>
      <ExpectedPayout payout={payout} />

      <div className={'mt-2 flex justify-between'}>
        Pay
        <div>Balance: {formatUnits(balance, decimals)}</div>
      </div>
      <div className={'input-md-wrapper'}>
        <input type="text" placeholder={'0.0'} value={amount} onChange={(e) => setAmount(e.target.value)} />
        <div className="ml-auto text-symbol">USDC</div>
      </div>

      <div className="flex justify-center mt-2">
        <ArrowDownIcon className={'font-extrabold w-[28px] h-[28px]'} />
      </div>
      <div className={'flex justify-between -mt-4'}>Long</div>
      <div className={'input-md-wrapper'}>
        <input type="text" placeholder={'0.0'} value={formatUnits(BigInt(get), decimals)} disabled readOnly />
        <div className="ml-auto text-symbol">{isUp ? 'UP' : 'DOWN'}</div>
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
        <div className="flex justify-between">
          <div>Avg. Entry Price</div>
          <div>${formatBalance(price, 18, 2)}</div>
        </div>
        <div className="flex justify-between">
          <div>Total Cost</div>
          <div>${formatBalance(spent, decimals, 4)}</div>
        </div>
        <div className="flex justify-between">
          <div className={'font-bold'}>Expected P/L</div>
          <div className={'text-dark-primary font-bold'}>+${formatBalance(plAmount, decimals, 4)}</div>
        </div>
      </div>
    </div>
  );
};
