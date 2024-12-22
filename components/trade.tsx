import Image from 'next/image';
import { useState } from 'react';
import { ArrowDownIcon, DoubleArrowUpIcon, ThickArrowDownIcon, ThickArrowUpIcon } from '@radix-ui/react-icons';

export const Trade = ({ show }: { show: boolean }) => {
  const [amount, setAmount] = useState('');

  return (
    <div
      className={`grid grid-cols-3 gap-6 bg-cyan border-4 border-black p-6 gap-1 rounded-b-lg -mt-[2px] w-full font-roboto ${show ? '' : 'hidden'}`}
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
          <div>
            <Image src={'/up.png'} alt={'up'} width={186} height={96} />
          </div>
          <div>
            <Image src={'/down.png'} alt={'up'} width={186} height={125} />
          </div>
        </div>
        <div className={'text-center'}>Expected Payout</div>
        <div className={'font-chela text-primary text-4xl drop-shadow-md text-center -mt-3'}>+154%</div>

        <div className={'mt-4 flex justify-between'}>
          Pay
          <div>Balance: 0.00</div>
        </div>
        <div className={'border-2 border-black rounded-lg px-3 py-2 flex items-center text-xl'}>
          <input
            type="text"
            placeholder={'0.0'}
            className={'bg-transparent outline-none appearance-none text-lg w-full'}
            onChange={(e) => setAmount(e.target.value)}
          />
          <div className="flex ml-auto">
            <div>DITANIC</div>
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
            onChange={(e) => setAmount(e.target.value)}
          />
          <div className="flex ml-auto">
            <div>Put</div>
          </div>
        </div>

        <button
          className={
            'bg-gradient-to-r from-left to-right font-chela text-2xl text-center py-1 w-full rounded-lg border-2 border-black mt-4 shadow-2xl'
          }
        >
          Confirm
        </button>

        <div className="flex justify-between mt-6">
          <div>Avg. entry price</div>
          <div>$0.54</div>
        </div>
        <div className="flex justify-between">
          <div>Total cost</div>
          <div>$10.23</div>
        </div>
        <div className="flex justify-between">
          <div className={'font-bold'}>Expected P/L</div>
          <div className={'text-primary'}>+$0.54</div>
        </div>
      </div>
    </div>
  );
};
