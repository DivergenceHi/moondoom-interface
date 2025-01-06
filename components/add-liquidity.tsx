'use client';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useShortPositions } from '@/hooks/use-short-positions';
import { AddLiquidityGuide } from '@/components/add-liquidity-guide';
import { ShortCard } from '@/components/short-card';
import { useState } from 'react';
import { ShortPositionPortfolio } from '@/components/short-position-portfolio';
import { ShortPosition } from '@/types/position';
import { CloseShort } from '@/components/close-short';
import clsx from 'clsx';

dayjs.extend(utc);

export const AddLiquidity = ({ show, battleId }: { show: boolean; battleId: string }) => {
  const [index, setIndex] = useState(1);
  // const { battles } = useBattles();
  // const battle = battles?.find((battle) => battle.id === battleId);
  const { shortPositions, refetch } = useShortPositions();
  const positions = shortPositions
    ?.filter((position) => position.battle.id === battleId)
    .sort((a: ShortPosition, b: ShortPosition) => Number(b.tokenId) - Number(a.tokenId));
  const addIndex = (positions?.length ?? 0) + 1;

  if (!positions) {
    return <></>;
  }

  return (
    <div className={`grid grid-cols-2 gap-1 -mt-[2px] w-full drop-md-shadow font-roboto ${show ? '' : 'hidden'}`}>
      <div className={'bg-cyan px-12 pt-4 pb-12 border-2 border-black rounded-b-2xl'}>
        <div className={'mb-8 flex items-center'}>
          {positions?.map((position, i: number) => (
            <div
              className={clsx(
                'border-2 border-black rounded-full flex items-center justify-center bg-white text-3xl font-chela w-[40px] h-[40px] cursor-pointer',
                {
                  '!bg-primary': index === i + 1,
                },
              )}
              key={i}
              onClick={() => setIndex(i + 1)}
            >
              {i + 1}
            </div>
          ))}
          <div
            className={clsx(
              'border-2 border-black rounded-full flex items-center justify-center bg-white text-3xl font-chela w-[40px] h-[40px] cursor-pointer',
              {
                '!bg-primary': addIndex === index,
              },
            )}
            onClick={() => setIndex(addIndex)}
          >
            {addIndex}
          </div>
        </div>
        {index < addIndex && positions && <ShortPositionPortfolio position={{ ...positions[index - 1] }} />}
        {index === addIndex && <ShortCard battle={positions?.[0]?.battle} refetch={refetch} setIndex={setIndex} />}
      </div>
      <div className={'bg-cyan px-12 py-4 border-2 border-black rounded-b-2xl font-roboto'}>
        {index === addIndex && <AddLiquidityGuide />}
        {index < addIndex && positions && <CloseShort position={{ ...positions[index - 1] }} refetch={refetch} />}
      </div>
    </div>
  );
};
