import clsx from 'clsx';
import Image from 'next/image';
import { Address, erc20Abi, formatUnits, parseUnits } from 'viem';
import { ArrowDownIcon, ArrowLeftIcon } from '@radix-ui/react-icons';
import { formatBalance } from '@/lib/format';
import { useAccount, useReadContracts, useWriteContract } from 'wagmi';
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

export const LongCard = ({ setMode, owned }: { setMode: (mode: number) => void; owned: boolean }) => {
  const { address } = useAccount();
  const [amount, setAmount] = useState('');
  const [isUp, setIsUp] = useState(false);
  const debounceAmount = useDebounce(amount, 1000);
  const currentCollateral = COLLATERALS.find((c) => c.name === 'USDC');
  const decimals = currentCollateral?.decimals ?? 18;
  const { battles } = useBattles();

  const battle = battles?.[0];

  const { data } = useReadContracts({
    contracts: [
      {
        abi: erc20Abi,
        address: currentCollateral?.address,
        functionName: 'balanceOf',
        args: [address as Address],
      },
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
    ],
  });

  const balance = data?.[0]?.result ?? 0n;
  const spearBalance = data?.[1]?.result ?? 0n;
  const shieldBalance = data?.[2]?.result ?? 0n;
  console.log(spearBalance, shieldBalance);

  const tolerance = 10;
  const { get, spent } = useQuote(debounceAmount, battle?.battle_info.battle, isUp, TradeMode.EXACT_INPUT, decimals);

  const { writeContractAsync } = useWriteContract();

  const onMarket = async () => {
    try {
      const min = new BigNumber(get.toString())
        .times(100 - tolerance)
        .dividedBy(100)
        .toFixed(0, BigNumber.ROUND_UP);

      const args = {
        battleKey: {
          expiries: battle.bk.expiries,
          collateral: battle.bk.collateral,
          underlying: battle.bk.underlying,
          strikeValue: battle.bk.strikeValue,
        },
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
  };

  const price = get > 0n ? (parseUnits(amount, decimals) * 10n ** 18n) / get : 0n;

  const can = parseUnits(amount, decimals) > 0n;

  return (
    <div className={'relative'}>
      {owned && (
        <ArrowLeftIcon className={'absolute cursor-pointer'} width={26} height={26} onClick={() => setMode(1)} />
      )}
      <div className={'flex pt-6'}>
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
      <div className={'text-center'}>Expected Payout</div>
      <div className={'font-chela text-primary text-4xl drop-shadow-md text-center -mt-3'}>+154%</div>

      <div className={'mt-4 flex justify-between'}>
        Pay
        <div>Balance: {formatUnits(balance, decimals)}</div>
      </div>
      <div className={'border-2 border-black rounded-lg px-3 py-2 flex items-center text-xl'}>
        <input
          type="text"
          placeholder={'0.0'}
          className={'bg-transparent outline-none appearance-none text-lg w-full'}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <div className="ml-auto text-symbol">USDC</div>
      </div>

      <div className="flex justify-center mt-4">
        <ArrowDownIcon className={'font-bold w-[28px] h-[28px]'} />
      </div>
      <div className={'flex justify-between'}>Long</div>
      <div className={'border-2 border-black rounded-lg px-3 py-2 flex items-center text-xl'}>
        <input
          type="text"
          placeholder={'0.0'}
          className={'bg-transparent outline-none appearance-none text-lg w-full'}
          value={formatUnits(BigInt(get), decimals)}
          disabled
        />
        <div className="ml-auto text-symbol">{}</div>
      </div>

      <button className={clsx('btn-md-primary')} disabled={!can} onClick={onMarket}>
        Confirm
      </button>

      <div className="flex justify-between mt-6">
        <div>Avg. entry price</div>
        <div>${formatBalance(price, 18, 2)}</div>
      </div>
      <div className="flex justify-between">
        <div>Total cost</div>
        <div>${formatBalance(spent, decimals, 4)}</div>
      </div>
      <div className="flex justify-between">
        <div className={'font-bold'}>Expected P/L</div>
        <div className={'text-primary'}>+${formatUnits(BigInt(get), decimals)}</div>
      </div>
    </div>
  );
};