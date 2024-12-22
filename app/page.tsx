'use client';
import { Header } from '@/components/header';
import Image from 'next/image';
import { GainChart } from '@/components/gain-chart';
import { PlusIcon } from '@radix-ui/react-icons';
import { AddLiquidity } from '@/components/add-liquidity';
import { useState } from 'react';
import { Trade } from '@/components/trade';

export default function Home() {
  const [show, setShow] = useState(false);
  const [showTrade, setShowTrade] = useState(false);

  return (
    <div className="bg-gradient-to-r from-[rgb(10,27,40)] to-[rgb(25,63,61)] pb-20 min-h-screen">
      <Header />
      <div className={'container mx-auto lg:px-32'}>
        <div className={'font-dela text-white text-2xl text-center mt-4 mb-8'}>
          Which Coin will Go <span className={'text-primary'}>Up</span>?
        </div>
        <div className="flex text-white font-chela gap-4 items-center">
          <div className={'border-2 rounded-md border-primary pr-2 flex items-center'}>
            <Image src={'/mooner.png'} alt={'mooner'} width={32} height={32} />
            Mooners
          </div>
          <div className={'border-2 rounded-md border-danger pr-2 flex items-center'}>
            <Image src={'/doomer.png'} alt={'doomer'} width={26} height={26} />
            Doomers
          </div>
          <div className={'border-2 rounded-md border-[#FED237] pr-2 flex items-center text-danger px-3 text-xl'}>
            Trending
          </div>

          <div className={'border-2 rounded-md border-primary px-2 flex items-center ml-auto'}>Add a New Coin</div>
        </div>
        <div className="overflow-x-scroll">
          <div className={'min-w-[800px]'}>
            <div
              className={'bg-cyan border-2 border-black rounded-lg flex px-6 py-1 font-roboto text-xl font-bold mt-4'}
            >
              <div className="w-[220px]">Coin</div>
              <div className="w-[100px]">Price</div>
              <div className="w-[200px]">Price Last Week</div>
              <div className="w-[300px] text-center">Odds</div>
              <div className="w-[140px] text-center">Trade</div>
              <div className="w-[100px] text-center">Liquidity</div>
            </div>
            <div className={'flex items-center bg-white rounded-lg border-2 border-black mt-4 px-6 py-4'}>
              <div className="w-[220px] flex items-center gap-4">
                <Image src={'/hp.png'} alt={'hp'} width={64} height={64} />
                <div>
                  <div className={'text-xl font-bold font-roboto'}>BITCOIN/USD</div>
                  <div>0x79f49..9f3</div>
                </div>
              </div>

              <div className="w-[100px] font-chela text-3xl">
                $0.20
                <div className={'text-primary font-roboto text-sm'}>+0.90%</div>
              </div>

              <div className="w-[200px] flex flex-col justify-center">
                <div className="flex items-end gap-[1px]">
                  <GainChart isGain={true} count={5} />
                  <GainChart isGain={true} count={1} />
                  <GainChart isGain={true} count={0} />
                  <GainChart isGain={true} count={3} />
                  <GainChart isGain={true} count={0} />
                  <GainChart isGain={true} count={0} />
                  <GainChart isGain={true} count={2} />
                </div>
                <div className={'bg-black h-[4px] w-[104px] my-[2px]'}></div>
                <div className="flex items-start gap-[1px]">
                  <GainChart isGain={false} count={0} />
                  <GainChart isGain={false} count={0} />
                  <GainChart isGain={false} count={3} />
                  <GainChart isGain={false} count={0} />
                  <GainChart isGain={false} count={3} />
                  <GainChart isGain={false} count={5} />
                  <GainChart isGain={false} count={0} />
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
                      53%
                    </div>
                    <div
                      className={
                        'border-2 border-primary rounded-lg bg-black text-white text-2xl pl-14 pr-8 -ml-10 z-1'
                      }
                    >
                      Up
                    </div>
                  </div>
                  <div>Payout: 1.25x</div>
                </div>

                <div className={'flex flex-col items-center'}>
                  <div className="flex font-chela items-center">
                    <div
                      className={'border-2 border-danger rounded-lg bg-black text-white text-2xl pr-8 pl-4 -mr-6 z-1'}
                    >
                      Down
                    </div>
                    <div
                      className={
                        'w-[48px] h-[48px] border-2 border-danger rounded-full flex items-center justify-center bg-black text-white text-2xl z-20'
                      }
                    >
                      57%
                    </div>
                  </div>
                  <div>Payout: 1.25x</div>
                </div>
              </div>
              <div className={'w-[140px] flex justify-center'}>
                <button
                  className={'border-2 border-black rounded-lg px-4 bg-primary font-chela text-2xl'}
                  onClick={() => {
                    setShowTrade(!showTrade);
                    setShow(false);
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
                  }}
                  className={
                    'border-2 border-black rounded-full w-[40px] h-[40px] flex items-center justify-center font-chela text-4xl'
                  }
                >
                  <PlusIcon className={'w-[26px] h-[26px] font-semibold'} />
                </button>
              </div>
            </div>

            <div className="px-10">
              <AddLiquidity show={show} />
              <Trade show={showTrade} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
