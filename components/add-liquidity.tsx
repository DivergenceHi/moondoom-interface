'use client';

import { useState } from 'react';
import { useBattles } from '@/hooks/useBattles';
import { findCorrectTick } from '@/lib/tickAndPrice';
import { LiquidityType } from '@/types/battle';
import { useAccount, useWriteContract } from 'wagmi';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { COLLATERALS } from '@/constants/collaterals';
import { parseEther, parseUnits } from 'viem';
import { TradeAbi } from '@/constants/abis/trade';
import { POSITION_MANAGER_ADDRESS } from '@/constants/contracts';
import { base } from 'viem/chains';
import { waitForTransactionReceipt } from '@wagmi/core';
import { config } from '@/app/providers';
import { getPriceFromSqrtPriceX96 } from '@divergence-protocol/diver-sdk';
import clsx from 'clsx';

dayjs.extend(utc);

export const AddLiquidity = ({ show }: { show: boolean }) => {
  const { address } = useAccount();
  const [amount, setAmount] = useState('');
  const [mode, setMode] = useState<number>(null);
  const [min, setMin] = useState('0.01');
  const [max, setMax] = useState('0.99');
  console.log(amount);

  const { battles } = useBattles();

  const battle = battles?.[0];
  const shieldPrice = getPriceFromSqrtPriceX96(battle?.battle_info.sqrt_price_x96);

  const currentCollateral = COLLATERALS.find((c) => c.name === 'USDC');

  const { writeContractAsync } = useWriteContract();

  // const { data: canGet } = useAmountOfSTokenByMint(amount, isSpear, min, max, currentCollateral, battle);
  // console.log(canGet);

  const confirm = async () => {
    const battleKey = battle.bk;
    // const lowerValue = isSpear ? new BigNumber(1).minus(max).toFixed() : min;
    // const upperValue = isSpear ? new BigNumber(1).minus(min).toFixed() : max;
    const tickLower = findCorrectTick(min);
    const tickUpper = findCorrectTick(max);
    const x96 = BigInt(battle?.battle_info.sqrt_price_x96);

    const minSqrtPriceX96 = (x96 * 95n) / 100n;
    const maxSqrtPriceX96 = (x96 * 105n) / 100n;
    console.log(tickLower, tickUpper, minSqrtPriceX96, maxSqrtPriceX96);
    const deadline = BigInt(dayjs.utc(new Date()).unix() + 3600);

    const mintArgs = {
      battleKey,
      tickLower,
      tickUpper,
      minSqrtPriceX96,
      maxSqrtPriceX96,
      liquidityType: LiquidityType.Collateral,
      recipient: address,
      amount: parseUnits(amount, currentCollateral.decimals),
      deadline,
    };
    const hash = await writeContractAsync({
      abi: TradeAbi,
      address: POSITION_MANAGER_ADDRESS,
      functionName: 'addLiquidity',
      args: [mintArgs],
      chain: base,
      account: address,
    });
    await waitForTransactionReceipt(config, { hash });
  };

  const can = parseEther(amount) > 0n;

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
            className={clsx(
              'flex-between bg-white border-2 border-black rounded-lg w-full px-4 py-1 mb-2 font-medium',
              {
                'bg-gradient': mode === 0,
              },
            )}
            onClick={() => setMode(0)}
          >
            <div>Short Up</div>
            <div>{shieldPrice.toFixed(2)} - 0.99</div>
          </button>
          <button
            className={clsx(
              'flex-between bg-white border-2 border-black rounded-lg w-full px-4 py-1 mb-2 font-medium',
              {
                'bg-gradient': mode === 1,
              },
            )}
            onClick={() => setMode(1)}
          >
            <div>Short Down</div>
            <div>0.01 - {shieldPrice.toFixed(2)}</div>
          </button>
          <button
            className={clsx(
              'flex-between bg-white border-2 border-black rounded-lg w-full px-4 py-1 mb-2 font-medium',
              {
                'bg-gradient': mode === 2,
              },
            )}
            onClick={() => setMode(2)}
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
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <div className="flex ml-auto">
              <div>USDC</div>
            </div>
          </div>

          <div className={'mt-4'}>Short</div>
          <div className={'border-2 border-black rounded-lg px-3 py-2 flex items-center text-xl'}>
            {/*<input*/}
            {/*  type="text"*/}
            {/*  placeholder={'0.0'}*/}
            {/*  className={'bg-transparent outline-none appearance-none text-lg w-full'}*/}
            {/*  value={formatUnits(canGet, currentCollateral?.decimals ?? 18)}*/}
            {/*/>*/}
            <div className="flex ml-auto">
              <div>Put</div>
            </div>
          </div>

          <button
            className={
              'bg-gradient font-chela text-2xl text-center py-1 w-full rounded-lg border-2 border-black mt-4 shadow-2xl disabled:grayscale disabled:cursor-not-allowed'
            }
            onClick={confirm}
            disabled={!can}
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
