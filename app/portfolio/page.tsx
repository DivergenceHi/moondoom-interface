'use client';
import { Header } from '@/components/header';
import { useState } from 'react';
import clsx from 'clsx';
import { PortfolioLongPositions } from '@/components/portfolio-long-positions';
import { PortfolioShortPositions } from '@/components/portfolio-short-positions';
import { PortfolioLongHistory } from '@/components/portfolio-long-history';
import { PortfolioShortHistory } from '@/components/portfolio-short-history';

export default function Profile() {
  const [type, setType] = useState(0);

  return (
    <div className="bg-gradient-to-r from-[rgb(10,27,40)] to-[rgb(25,63,61)] pb-20 min-h-screen">
      <Header />
      <div className={'mx-auto w-[1080px] max-w-full'}>
        <div className={'font-dela text-white text-2xl text-center mt-4 mb-8'}>My Portfolio</div>
      </div>
      <div className="w-[998px] mx-auto max-w-full">
        <div className="flex items-center gap-2 font-chela mb-4 text-white text-lg">
          <button
            className={clsx('border-2 border-primary rounded-lg px-3', { 'text-primary': type === 0 })}
            onClick={() => setType(0)}
          >
            Long
          </button>
          <button
            className={clsx('border-2 border-primary rounded-lg px-3', { 'text-primary': type === 1 })}
            onClick={() => setType(1)}
          >
            Short
          </button>
          <button
            className={clsx('border-2 border-primary rounded-lg px-3', { 'text-primary': type === 2 })}
            onClick={() => setType(2)}
          >
            Long History
          </button>
          <button
            className={clsx('border-2 border-primary rounded-lg px-3', { 'text-primary': type === 3 })}
            onClick={() => setType(3)}
          >
            Short History
          </button>
        </div>
        {type === 0 && <PortfolioLongPositions />}
        {type === 1 && <PortfolioShortPositions />}
        {type === 2 && <PortfolioLongHistory />}
        {type === 3 && <PortfolioShortHistory />}
      </div>
    </div>
  );
}
