'use client';

import { useState } from 'react';

export const AddLiquidity = ({ show }: { show: boolean }) => {
  const [amount, setAmount] = useState('');
  console.log(amount);

  return (
    <div className={`grid grid-cols-2 gap-1 -mt-[2px] w-full font-roboto ${show ? '' : 'hidden'}`}>
      <div className={'bg-cyan px-8 pt-4 pb-12 border-2 border-black rounded-b-2xl'}>
        <div className={'mb-8 flex items-center'}>
          <div className="border-2 border-black rounded-full flex items-center justify-center bg-white text-3xl font-chela w-[40px] h-[40px]">
            1
          </div>
        </div>
        <div className={''}>
          <button
            className={
              'flex items-center justify-between bg-white border-2 border-black rounded-lg w-full px-4 py-1 mb-2 font-medium'
            }
          >
            <div>Short Up</div>
            <div>0.5 - 0.99</div>
          </button>
          <button
            className={
              'flex items-center justify-between bg-white border-2 border-black rounded-lg w-full px-4 py-1 mb-2 font-medium'
            }
          >
            <div>Short Down</div>
            <div>0.5 - 0.99</div>
          </button>
          <button
            className={
              'flex items-center justify-between bg-white border-2 border-black rounded-lg w-full px-4 py-1 font-medium'
            }
          >
            <div>Dual Liquidity</div>
            <div>0.01 - 0.99</div>
          </button>

          <div className={'mt-4'}>Deposit</div>
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

          <div className={'mt-4'}>Short</div>
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
            Add
          </button>
        </div>
      </div>
      <div className={'bg-cyan px-8 py-4 border-2 border-black rounded-b-2xl font-roboto'}>
        <div className={'text-2xl text-center font-medium mb-8'}>Guidance</div>
        <div className={'mb-8'}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas auctor auctor neque, vel hendrerit ante
          placerat nec. Aliquam ipsum sem, dignissim eget scelerisque non, congue in sapien. Morbi tellus eros, mollis
          vitae nisl sed, commodo tincidunt neque. Mauris id orci erat. Etiam tincidunt elit eget risus aliquam
        </div>

        <div>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas auctor auctor neque, vel hendrerit ante
          placerat nec. Aliquam ipsum sem, dignissim eget scelerisque non, congue in sapien. Morbi tellus eros, mollis
          vitae nisl sed, commodo tincidunt neque. Mauris id orci erat. Etiam tincidunt elit eget risus aliquam
        </div>
      </div>
    </div>
  );
};
