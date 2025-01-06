'use client';

import * as Select from '@radix-ui/react-select';
import { CheckIcon, TriangleDownIcon } from '@radix-ui/react-icons';
import Image from 'next/image';
import clsx from 'clsx';
import { forwardRef, useState } from 'react';
import { SelectItemProps } from '@/app/page';
import { NewShortCard } from '@/components/new-short-card';
import { COLLATERALS } from '@/constants/collaterals';
import { Address, parseEther } from 'viem';
import { AddLiquidityGuide } from '@/components/add-liquidity-guide';
import { useQuery } from '@tanstack/react-query';
import { getUnderlyingPrice } from '@/actions/underlying';
import { calculatePriceChange, calculateSevenDayChanges } from '@/lib/display';
import { GainChart } from '@/components/gain-chart';
import { useReadContract } from 'wagmi';
import { ArenaAbi } from '@/constants/abis/arena';
import { ARENA_ADDRESS } from '@/constants/contracts';
import { USDCIcon } from 'web3-icons';

const SelectItem = forwardRef<HTMLDivElement, SelectItemProps>(
  ({ children, className, value, ...props }, forwardedRef) => {
    return (
      <Select.Item className={clsx('SelectItem', className)} {...props} ref={forwardedRef} value={value}>
        <Select.ItemText>{children}</Select.ItemText>
        <Select.ItemIndicator className="SelectItemIndicator">
          <CheckIcon />
        </Select.ItemIndicator>
      </Select.Item>
    );
  },
);

SelectItem.displayName = 'SelectItem';

export const AddNewCoin = () => {
  const [show, setShow] = useState(false);
  const [underlying, setUnderlying] = useState('BTC');
  const [collateral, setCollateral] = useState('USDC');
  const currentCollateral = COLLATERALS.find((c) => c.name === 'USDC');

  const { data } = useQuery({
    queryKey: ['getUnderlyingPrice', underlying],
    queryFn: () => getUnderlyingPrice(underlying),
  });

  const priceChange = calculatePriceChange(data?.past_7days?.[0]?.price, data?.current_price);
  const past7DaysPriceChanges = calculateSevenDayChanges(data?.past_7days, data?.current_price);
  const strikeValue = parseEther(data?.past_7days?.[0]?.price ?? '0');

  console.log(strikeValue);

  const { data: battleData } = useReadContract({
    abi: ArenaAbi,
    address: ARENA_ADDRESS,
    functionName: 'getBattle',
    args: [
      {
        underlying,
        expiries: 1736640000n,
        strikeValue,
        collateral: currentCollateral?.address as Address,
      },
    ],
  });

  const isCreated = battleData !== '0x0000000000000000000000000000000000000000';
  console.log(battleData);

  return (
    <>
      <div className="flex justify-center gap-6">
        <div>
          <div className={'font-black text-xl'}>Underlying</div>
          <Select.Root defaultValue={'BTC'} onValueChange={(v) => setUnderlying(v)}>
            <Select.Trigger className="SelectTrigger" defaultValue={'BTC'} value={underlying} asChild>
              <div className={'flex items-center gap-2'}>
                <Select.Value placeholder="" />
                <TriangleDownIcon width={20} height={20} className={'ml-auto'} />
              </div>
            </Select.Trigger>
            <Select.Portal>
              <Select.Content className="SelectContent w-[160px]" sideOffset={10} side={'bottom'} position={'popper'}>
                <Select.Viewport className="SelectViewport">
                  <SelectItem value="BTC">
                    <div className="flex items-center gap-2">
                      <Image src={'/hp.png'} alt={'hp'} width={24} height={24} />
                      BTC
                    </div>
                  </SelectItem>
                  <SelectItem value="ETH/BTC">
                    <div className="flex items-center gap-2">
                      <Image src={'/hp.png'} alt={'hp'} width={24} height={24} />
                      ETH/BTC
                    </div>
                  </SelectItem>
                  <SelectItem value="SOL/ETH">
                    <div className="flex items-center gap-2">
                      <Image src={'/hp.png'} alt={'hp'} width={24} height={24} />
                      SOL/ETH
                    </div>
                  </SelectItem>
                </Select.Viewport>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
        </div>
        <div>
          <div className={'font-black text-xl'}>Betting Currency</div>
          <Select.Root defaultValue={'USDC'} onValueChange={(value) => setCollateral(value)} value={collateral}>
            <Select.Trigger className="SelectTrigger" defaultValue={'USDC'} asChild>
              <div className={'flex items-center gap-2'}>
                <Select.Value placeholder="" />
                <TriangleDownIcon width={20} height={20} className={'ml-auto'} />
              </div>
            </Select.Trigger>
            <Select.Portal>
              <Select.Content
                className="SelectContent w-[160px]"
                side={'bottom'}
                sideOffset={10}
                align={'end'}
                position={'popper'}
              >
                <Select.Viewport className="SelectViewport">
                  <SelectItem value="USDC">
                    <div className="flex items-center gap-2">
                      <USDCIcon width={20} height={20} />
                      USDC
                    </div>
                  </SelectItem>
                </Select.Viewport>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
        </div>
      </div>
      <div className={'font-semibold font-roboto text-xl'}>Available Pools</div>
      <div className={'bg-cyan border-2 border-black rounded-lg flex px-6 py-1 font-roboto text-xl font-bold'}>
        <div className="w-[18%]">Coin</div>
        <div className="w-[15%]">Current Price</div>
        <div className="w-[20%]">Price Last Week</div>
        <div className="w-[30%] text-center">Odds</div>
      </div>

      <div className={'flex items-center bg-white rounded-lg border-2 border-black mt-4 px-6 py-4'}>
        <div className="w-[18%] flex items-center gap-4">
          <Image src={'/hp.png'} alt={'hp'} width={64} height={64} />
          <div>
            <div className={'text-xl font-bold font-roboto'}>{underlying}</div>
          </div>
        </div>

        <div className="w-[15%] font-chela text-3xl">
          ${parseFloat(data?.current_price ?? '0').toFixed(2)}
          <div
            className={clsx('font-roboto text-sm', {
              'text-primary': priceChange.isPositive,
              'text-danger': priceChange.isNegative,
            })}
          >
            {priceChange.formatted}
          </div>
        </div>

        <div className="w-[20%] flex flex-col justify-center">
          <div className="flex items-end gap-[1px]">
            {past7DaysPriceChanges?.map((price, i) => (
              <GainChart key={i} isGain={true} count={price.priceChange.isPositive ? price.normalizedValue : 0} />
            ))}
          </div>
          <div className={'bg-black h-[4px] w-[104px] my-[2px]'}></div>
          <div className="flex items-start gap-[1px]">
            {past7DaysPriceChanges?.map((price, i) => (
              <GainChart key={i} isGain={false} count={price.priceChange.isNegative ? price.normalizedValue : 0} />
            ))}
          </div>
        </div>

        <div className="w-[30%] flex items-center gap-4">
          <div className={'flex flex-col items-center'}>
            <div className="flex font-chela items-center">
              <div
                className={
                  'w-[48px] h-[48px] border-2 border-primary rounded-full flex items-center justify-center bg-black text-white text-2xl z-20'
                }
              ></div>
              <div className={'border-2 border-primary rounded-lg bg-black text-white text-2xl pl-14 pr-8 -ml-10 z-1'}>
                Up
              </div>
            </div>
            <div>Payout</div>
          </div>

          <div className={'flex flex-col items-center'}>
            <div className="flex font-chela items-center">
              <div className={'border-2 border-danger rounded-lg bg-black text-white text-2xl pr-8 pl-4 -mr-6 z-1'}>
                Down
              </div>
              <div
                className={
                  'w-[48px] h-[48px] border-2 border-danger rounded-full flex items-center justify-center bg-black text-white text-2xl z-20'
                }
              ></div>
            </div>
            <div>Payout</div>
          </div>
        </div>
        <div className={'w-[200px] flex justify-center'}>
          {isCreated ? (
            <>Created</>
          ) : (
            <button
              className={
                'bg-primary font-roboto px-4 py-2 rounded-xl border-2 border-black text-white font-bold text-xl'
              }
              onClick={() => setShow(true)}
            >
              New Deposit
            </button>
          )}
        </div>
      </div>

      {show && (
        <div className="grid grid-cols-2 gap-6 px-10">
          <div className={'bg-cyan px-8 pt-4 pb-12 border-2 border-black rounded-b-2xl'}>
            <NewShortCard
              underlying={underlying}
              collateral={currentCollateral?.address as Address}
              strikeValue={strikeValue}
            />
          </div>
          <div className={'bg-cyan px-8 pt-4 pb-12 border-2 border-black rounded-b-2xl'}>
            <AddLiquidityGuide />
          </div>
        </div>
      )}
    </>
  );
};
