import Image from 'next/image';
import { useState } from 'react';
import { ArrowDownIcon, ThickArrowDownIcon, ThickArrowUpIcon } from '@radix-ui/react-icons';
import { useDebounce } from '@/hooks/useDebounce';
import { useQuote } from '@/hooks/useQuote';
import { useAccount, useReadContract, useReadContracts, useWriteContract } from 'wagmi';
import { ArenaAbi } from '@/constants/abis/arena';
import { ARENA_ADDRESS, POSITION_MANAGER_ADDRESS } from '@/constants/contracts';
import { Battle } from '@/types/battle';
import { COLLATERALS } from '@/constants/collaterals';
import { BigNumber } from 'bignumber.js';
import { getSqrtPriceX96FromPrice } from '@divergence-protocol/diver-sdk';
import dayjs from 'dayjs';
import { Address, erc20Abi, formatUnits, parseUnits } from 'viem';
import { TradeAbi } from '@/constants/abis/trade';
import { base } from 'viem/chains';
import { waitForTransactionReceipt } from '@wagmi/core';
import { config } from '@/app/providers';
import clsx from 'clsx';

export const Trade = ({ show }: { show: boolean }) => {
  const { address } = useAccount();
  const [amount, setAmount] = useState('');
  const [isSpear, setIsSpear] = useState(false);
  console.log(amount);
  const debounceAmount = useDebounce(amount, 1000);
  const currentCollateral = COLLATERALS.find((c) => c.name === 'USDC');
  const { data } = useReadContracts({
    contracts: [
      {
        abi: erc20Abi,
        address: currentCollateral.address,
        functionName: 'balanceOf',
        args: [address as Address],
      },
    ],
  });
  console.log(data);
  const balance = data?.[0]?.result ?? 0n;
  const { data: battles } = useReadContract({
    abi: ArenaAbi,
    address: ARENA_ADDRESS,
    functionName: 'getAllBattles',
  });
  const battle = (battles as Battle[])?.find((b) => b.battle === '0x1C8b4877176ee398a52DF0e4D9CEc69f409F3eC7');
  console.log(battle);
  const tolerance = 10;
  const { get, odd, spent, fee, index } = useQuote(
    debounceAmount,
    battle?.battle,
    isSpear,
    0,
    currentCollateral.decimals,
  );
  console.log(get, formatUnits(BigInt(get), 6));

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
        tradeType: isSpear ? 0 : 1,
        amountSpecified: parseUnits(amount, currentCollateral.decimals),
        recipient: address,
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

  const decimals = currentCollateral.decimals;
  const price = Number(get) > 0 && (parseUnits(amount, decimals) * 10n ** 18n) / parseUnits(get, decimals);

  return (
    <div
      className={`grid grid-cols-3 gap-6 bg-cyan border-4 border-black p-6 rounded-b-lg -mt-[2px] w-full font-roboto ${show ? '' : 'hidden'}`}
    >
      <div className={'col-span-2'}>
        <div className={'p-6 pb-12 border-[3px] border-black rounded-2xl bg-white mb-6'}>
          <div className="flex mb-6">
            <div className={'border-2 border-primary rounded-l-lg px-4 py-1 font-chela bg-black text-white text-2xl'}>
              00:59
            </div>
            <div className={'border-2 border-primary -ml-[2px] rounded-r-lg font-roboto flex items-center px-4'}>
              November 12, 2024
            </div>
          </div>

          <div className={'h-[400px] relative'}>
            <div className={'absolute top-[50px] left-[50px] flex items-center text-primary font-bold'}>
              <ThickArrowUpIcon className={'text-primary w-[40px] h-[60px] '} />
              Up wins
            </div>
            <div className={'absolute top-[100px] left-[160px] flex items-center text-danger font-bold'}>
              <ThickArrowDownIcon className={'text-danger w-[40px] h-[60px] '} />
              Down wins
            </div>
            <div className={'absolute bg-primary bg-opacity-20 h-[100px] w-full'}></div>
            <div className={'absolute bg-danger bg-opacity-20 h-[300px] w-full bottom-0'}></div>
            <div className={'bg-danger text-white flex justify-between absolute right-0 w-[260px] top-[86px] px-4'}>
              Target Price
              <div>(+2.0%)</div>
              <div>97860.0</div>
            </div>
          </div>
        </div>

        <div className="bg-white px-12 py-8 border-[3px] border-black rounded-2xl text-center">
          If BITCOIN/USD settles above target, <span className={'text-primary font-semibold'}>UP</span> wins and pays 1
          USDT, otherwise <span className={'text-danger font-semibold'}>DOWN</span> wins and pays 1 USDT. Say Goodbye to
          liquidation!
        </div>
      </div>

      <div className={'col-span-1 border-[3px] border-black p-6 bg-white rounded-xl'}>
        <div className={'flex'}>
          <div
            onClick={() => setIsSpear(true)}
            className={clsx('cursor-pointer grayscale', {
              'grayscale-0': isSpear,
            })}
          >
            <Image src={'/up.png'} alt={'up'} width={186} height={96} />
          </div>
          <div
            onClick={() => setIsSpear(false)}
            className={clsx('cursor-pointer grayscale', {
              'grayscale-0': !isSpear,
            })}
          >
            <Image src={'/down.png'} alt={'up'} width={186} height={125} />
          </div>
        </div>
        <div className={'text-center'}>Expected Payout</div>
        <div className={'font-chela text-primary text-4xl drop-shadow-md text-center -mt-3'}>+154%</div>

        <div className={'mt-4 flex justify-between'}>
          Pay
          <div>Balance: {formatUnits(balance, currentCollateral.decimals)}</div>
        </div>
        <div className={'border-2 border-black rounded-lg px-3 py-2 flex items-center text-xl'}>
          <input
            type="text"
            placeholder={'0.0'}
            className={'bg-transparent outline-none appearance-none text-lg w-full'}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <div className="flex ml-auto">
            <div>USDC</div>
          </div>
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
            value={formatUnits(BigInt(get), currentCollateral.decimals)}
            disabled
          />
          <div className="flex ml-auto">
            <div>Put</div>
          </div>
        </div>

        <button
          className={
            'bg-gradient-to-r from-left to-right font-chela text-2xl text-center py-1 w-full rounded-lg border-2 border-black mt-4 shadow-2xl'
          }
          onClick={onMarket}
        >
          Confirm
        </button>

        <div className="flex justify-between mt-6">
          <div>Avg. entry price</div>
          <div>${formatUnits(price, 18).toString()}</div>
        </div>
        <div className="flex justify-between">
          <div>Total cost</div>
          <div>${formatUnits(BigInt(spent), currentCollateral.decimals)}</div>
        </div>
        <div className="flex justify-between">
          <div className={'font-bold'}>Expected P/L</div>
          <div className={'text-primary'}>+${formatUnits(BigInt(get), currentCollateral.decimals)}</div>
        </div>
      </div>
    </div>
  );
};
