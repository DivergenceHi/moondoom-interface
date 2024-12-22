'use client';

import { ARENA_ADDRESS, defaultBattleKey, POSITION_MANAGER_ADDRESS } from '@/constants/contracts';
import { useState } from 'react';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { Battle, LiquidityType } from '@/types/battle';
import { getSqrtPriceX96FromMin } from '@/lib/battle';
import { BigNumber } from 'bignumber.js';
import { findCorrectTick } from '@/lib/tickAndPrice';
import { getSqrtPriceX96FromPrice } from '@divergence-protocol/diver-sdk';
import { COLLATERALS } from '@/constants/collaterals';
import { encodeFunctionData, formatUnits } from 'viem';
import { BattleAbi } from '@/constants/abis/battle';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { TradeAbi } from '@/constants/abis/trade';
import { base } from 'viem/chains';
import { waitForTransactionReceipt } from '@wagmi/core';
import { config } from '@/app/providers';
import { useAmountOfSTokenByMint } from '@/hooks/useAmountOfSTokenByMint';
import { ArenaAbi } from '@/constants/abis/arena';

dayjs.extend(utc);

export const AddLiquidity = ({ show }: { show: boolean }) => {
  const { address } = useAccount();
  const [amount, setAmount] = useState('');
  console.log(amount);

  const { writeContractAsync } = useWriteContract();

  const { data: battles } = useReadContract({
    abi: ArenaAbi,
    address: ARENA_ADDRESS,
    functionName: 'getAllBattles',
  });

  const isSpear = true;
  const min = '0.5';
  const max = '0.99';
  const x96 = getSqrtPriceX96FromMin(isSpear, min.toString());

  const battle = (battles as Battle[])?.find((b) => b.battle === '0x1C8b4877176ee398a52DF0e4D9CEc69f409F3eC7');
  console.log(battle);
  const currentCollateral = COLLATERALS.find((c) => c.name === 'USDC');

  const { data: canGet } = useAmountOfSTokenByMint(amount, isSpear, min, max, currentCollateral, battle);
  console.log(canGet);

  const confirm = async () => {
    try {
      const battleKey = defaultBattleKey;

      const createArgs = {
        bk: battleKey,
        sqrtPriceX96: BigInt(x96),
      };
      const lowerValue = isSpear ? new BigNumber(1).minus(max).toFixed() : min;
      const upperValue = isSpear ? new BigNumber(1).minus(min).toFixed() : max;
      const tickLowerAfter = findCorrectTick(lowerValue);
      const tickUpperAfter = findCorrectTick(upperValue);

      const midX96 = getSqrtPriceX96FromPrice(isSpear ? 1 - Number(min) : Number(min));
      const minX96 = midX96.multipliedBy(0.95);
      const maxX96 = midX96.multipliedBy(1.05);
      // if (battle) {
      //   minX96 = new BigNumber(battle?.sqrtPriceX96.toString() ?? '0').multipliedBy(0.95);
      //   maxX96 = new BigNumber(battle?.sqrtPriceX96.toString() ?? '0').multipliedBy(1.05);
      // }

      const mintArgs = {
        battleKey,
        tickLower: tickLowerAfter,
        tickUpper: tickUpperAfter,
        minSqrtPriceX96: BigInt(minX96.toFixed(0)),
        maxSqrtPriceX96: BigInt(maxX96.toFixed(0)),
        liquidityType: LiquidityType.Collateral,
        recipient: address,
        amount: BigInt(new BigNumber(amount)?.multipliedBy(10 ** (currentCollateral?.decimals ?? 18)).toFixed()),
        deadline: BigInt((dayjs.utc(new Date()).unix() + 3600).toString()),
      };
      const createCalldata = encodeFunctionData({
        abi: BattleAbi,
        functionName: 'createAndInitializeBattle',
        args: [createArgs],
      });
      const mintCalldata = encodeFunctionData({
        abi: TradeAbi,
        functionName: 'addLiquidity',
        args: [mintArgs],
      });

      if (defaultBattleKey) {
        const hash = await writeContractAsync({
          abi: TradeAbi,
          address: POSITION_MANAGER_ADDRESS,
          functionName: 'addLiquidity',
          args: [mintArgs],
          chain: base,
          account: address,
        });
        await waitForTransactionReceipt(config, { hash });
      } else {
        const hash = await writeContractAsync({
          abi: BattleAbi,
          address: POSITION_MANAGER_ADDRESS,
          functionName: 'multicall',
          args: [[createCalldata, mintCalldata]],
          chain: base,
          account: address,
        });

        await waitForTransactionReceipt(config, { hash });
      }
    } catch (e) {
      console.error(e);
    }
  };

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
              <div>USDC</div>
            </div>
          </div>

          <div className={'mt-4'}>Short</div>
          <div className={'border-2 border-black rounded-lg px-3 py-2 flex items-center text-xl'}>
            <input
              type="text"
              placeholder={'0.0'}
              className={'bg-transparent outline-none appearance-none text-lg w-full'}
              value={formatUnits(canGet, currentCollateral?.decimals ?? 18)}
            />
            <div className="flex ml-auto">
              <div>Put</div>
            </div>
          </div>

          <button
            className={
              'bg-gradient-to-r from-left to-right font-chela text-2xl text-center py-1 w-full rounded-lg border-2 border-black mt-4 shadow-2xl'
            }
            onClick={confirm}
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
