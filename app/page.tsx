'use client';
import { Header } from '@/components/header';
import Image from 'next/image';
import { GainChart } from '@/components/gain-chart';
import { PlusIcon } from '@radix-ui/react-icons';
import { ReactNode, useEffect, useState } from 'react';
import { Trade } from '@/components/trade';
import { useBattles } from '@/hooks/useBattles';
import clsx from 'clsx';
import { calculatePriceChange, calculateSevenDayChanges, ellipseAddress } from '@/lib/display';
import { getPriceFromSqrtPriceX96 } from '@divergence-protocol/diver-sdk';
import { BigNumber } from 'bignumber.js';
import { AddLiquidity } from '@/components/add-liquidity';
import { CloseIcon } from '@/components/icons/close';
import { AddNewCoin } from '@/components/add-new-coin';

export interface SelectItemProps {
  children?: ReactNode;
  className?: string;
  value: string;
}

export default function Home() {
  const [show, setShow] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [index, setIndex] = useState(-1);
  const [showTrade, setShowTrade] = useState(false);
  const { battles, isLoading } = useBattles();
  const [category, setCategory] = useState('mooner');
  const filterBattles = battles?.filter((battle) => battle.category === category);

  useEffect(() => {
    if (battles && battles.length > 0) {
      setCategory(battles[0].category);
    }
  }, [battles]);

  if (showAdd) {
    return (
      <div className="bg-gradient-to-r from-[rgb(10,27,40)] to-[rgb(25,63,61)] pb-20 min-h-screen">
        <Header />
        <div className={'mx-auto w-[1080px] max-w-full'}>
          <div className={'bg-[#EBFFFB] rounded-2xl border-2 border-black px-8 pt-2 pb-8 mt-6 relative font-roboto'}>
            <CloseIcon className={'absolute right-4 top-4 cursor-pointer'} onClick={() => setShowAdd(false)} />
            <AddNewCoin />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-[rgb(10,27,40)] to-[rgb(25,63,61)] pb-20 min-h-screen">
      <Header />
      <div className={'mx-auto w-[1080px] max-w-full'}>
        <div className={'font-dela text-white text-2xl text-center mt-4 mb-8'}>
          Which Coin will Go <span className={'text-primary'}>Up</span>?
        </div>
        <div className="flex text-white font-chela gap-4 items-center">
          <div
            className={clsx('border-2 rounded-md border-primary pr-2 flex items-center cursor-pointer', {
              'bg-primary': category === 'mooner',
            })}
            onClick={() => setCategory('mooner')}
          >
            <Image src={'/mooner.png'} alt={'mooner'} width={32} height={32} />
            Mooners
          </div>
          <div
            className={clsx('border-2 rounded-md border-danger pr-2 flex items-center cursor-pointer', {
              'bg-danger': category === 'doomer',
            })}
            onClick={() => setCategory('doomer')}
          >
            <Image src={'/doomer.png'} alt={'doomer'} width={26} height={26} />
            Doomers
          </div>
          <div
            className={clsx(
              'border-2 rounded-md border-[#FED237] pr-2 flex items-center text-danger px-3 text-xl cursor-pointer',
              {
                'bg-[#FED237]': category === 'trending',
              },
            )}
            onClick={() => setCategory('trending')}
          >
            Trending
          </div>

          <div
            className={'border-2 rounded-md border-primary px-2 flex items-center ml-auto cursor-pointer'}
            onClick={() => setShowAdd(true)}
          >
            Add a New Coin
          </div>
        </div>
        <div className="overflow-x-scroll">
          <div className={'min-w-[800px]'}>
            <div
              className={'bg-cyan border-2 border-black rounded-lg flex px-6 py-1 font-roboto text-xl font-bold mt-4'}
            >
              <div className="w-[220px]">Coin</div>
              <div className="w-[120px]">Price</div>
              <div className="w-[200px]">Price Last Week</div>
              <div className="w-[300px] text-center">Odds</div>
              <div className="w-[140px] text-center">Trade</div>
              <div className="w-[100px] text-center">Liquidity</div>
            </div>

            {isLoading && (
              <div className={'flex items-center bg-white rounded-lg border-2 border-black mt-4 px-6 py-4 h-[100px]'}>
                <div className={'w-[60px] bg-gray-100 h-[60px] animate-pulse rounded-lg'}></div>
                <div className={'ml-4'}>
                  <div className={'w-[60px] bg-gray-100 h-[20px] animate-pulse rounded-lg mb-2'}></div>
                  <div className={'w-[100px] bg-gray-100 h-[20px] animate-pulse rounded-lg'}></div>
                </div>
              </div>
            )}

            {filterBattles?.map((battle, i: number) => {
              const priceChange = calculatePriceChange(battle.past_7days[0].price, battle.current_price);
              const past7DaysPriceChanges = calculateSevenDayChanges(battle.past_7days, battle.current_price);
              const shieldPrice = getPriceFromSqrtPriceX96(battle.battle_info.sqrt_price_x96);
              const spearPrice = new BigNumber(1).minus(shieldPrice);
              const shieldpayout = new BigNumber(1).div(shieldPrice);
              const spearpayout = new BigNumber(1).div(spearPrice);

              return (
                <div key={battle?.battle_info?.battle}>
                  <div className={'flex items-center bg-white rounded-lg border-2 border-black mt-4 px-6 py-4'}>
                    <div className="w-[220px] flex items-center gap-4">
                      <Image src={'/hp.png'} alt={'hp'} width={64} height={64} />
                      <div>
                        <div className={'text-xl font-bold font-roboto'}>{battle.battle_info.bk.underlying}</div>
                        <div>{ellipseAddress(battle.battle_info.battle)}</div>
                      </div>
                    </div>

                    <div className="w-[120px] font-chela text-3xl">
                      ${parseFloat(battle.current_price).toFixed(2)}
                      <div
                        className={clsx('font-roboto text-sm', {
                          'text-primary': priceChange.isPositive,
                          'text-danger': priceChange.isNegative,
                        })}
                      >
                        {priceChange.formatted}
                      </div>
                    </div>

                    <div className="w-[200px] flex flex-col justify-center">
                      <div className="flex items-end gap-[1px]">
                        {past7DaysPriceChanges?.map((price, i) => (
                          <GainChart
                            key={i}
                            isGain={true}
                            count={price.priceChange.isPositive ? price.normalizedValue : 0}
                          />
                        ))}
                      </div>
                      <div className={'bg-black h-[4px] w-[104px] my-[2px]'}></div>
                      <div className="flex items-start gap-[1px]">
                        {past7DaysPriceChanges?.map((price, i) => (
                          <GainChart
                            key={i}
                            isGain={false}
                            count={price.priceChange.isNegative ? Math.abs(price.normalizedValue) : 0}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="w-[300px] flex items-center gap-4">
                      <div className={'flex flex-col items-center'}>
                        <div className="flex font-chela items-center">
                          <div
                            className={
                              'w-[48px] h-[48px] border-2 border-primary rounded-full flex items-center justify-center bg-black text-white text-2xl z-20'
                            }
                          >
                            {spearPrice.multipliedBy(100).toFixed(0)}%
                          </div>
                          <div
                            className={
                              'border-2 border-primary rounded-lg bg-black text-white text-2xl pl-14 pr-8 -ml-10 z-1'
                            }
                          >
                            Up
                          </div>
                        </div>
                        <div>Payout: {spearpayout.toFixed(2)}x</div>
                      </div>

                      <div className={'flex flex-col items-center'}>
                        <div className="flex font-chela items-center">
                          <div
                            className={
                              'border-2 border-danger rounded-lg bg-black text-white text-2xl pr-8 pl-4 -mr-6 z-1'
                            }
                          >
                            Down
                          </div>
                          <div
                            className={
                              'w-[48px] h-[48px] border-2 border-danger rounded-full flex items-center justify-center bg-black text-white text-2xl z-20'
                            }
                          >
                            {shieldPrice.multipliedBy(100).toFixed(0)}%
                          </div>
                        </div>
                        <div>Payout: {shieldpayout.toFixed(2)}x</div>
                      </div>
                    </div>
                    <div className={'w-[140px] flex justify-center'}>
                      <button
                        className={'border-2 border-black rounded-lg px-4 bg-primary font-chela text-2xl'}
                        onClick={() => {
                          setShowTrade(!showTrade);
                          setShow(false);
                          setIndex(i);
                        }}
                      >
                        Trade
                      </button>
                    </div>
                    <div className={'w-[100px] flex justify-center'}>
                      <button
                        onClick={() => {
                          setShow(!show);
                          setShowTrade(false);
                          setIndex(i);
                        }}
                        className={
                          'border-2 border-black rounded-full w-[40px] h-[40px] flex items-center justify-center font-chela text-4xl'
                        }
                      >
                        <PlusIcon className={'w-[26px] h-[26px] font-semibold'} />
                      </button>
                    </div>
                  </div>
                  <div className="px-8">
                    <AddLiquidity show={show && index === i} battleId={battle.battle_info.battle} />
                    <Trade show={showTrade && index === i} battleId={battle.battle_info.battle} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
