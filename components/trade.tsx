import { COLLATERALS } from '@/constants/collaterals';
import dayjs from 'dayjs';
import { Address } from 'viem';
import { usePriceStream } from '@/hooks/use-price-stream';
import PriceChart from '@/components/price-chart';
import { useBattles } from '@/hooks/useBattles';
import Countdown from 'react-countdown';
import { LongCard } from '@/components/long-card';
import { useEffect, useState } from 'react';
import { LongPortfolio } from '@/components/long-portfolio';
import { CloseLong } from '@/components/close-long';
import { PYTH_FEED_IDS, UnderlyingType } from '@/constants/pyth';
import { formatBalance } from '@/lib/format';
import { ClockIcon } from '@radix-ui/react-icons';
import { useBalances } from '@/hooks/use-balances';

const renderer = ({
  days,
  hours,
  minutes,
  seconds,
  completed,
}: {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  completed: boolean;
}) => {
  const padTimeUnit = (num: number) => String(num).padStart(2, '0');

  if (completed)
    return (
      <>
        {seconds}
        {hours}
        {days}
      </>
    );
  return (
    <div className={'text-lg font-risque w-[70px]'}>
      {padTimeUnit(hours)}:{padTimeUnit(minutes)}:{padTimeUnit(seconds)}
    </div>
  );
};

export const Trade = ({ show, battleId }: { show: boolean; battleId: Address }) => {
  const currentCollateral = COLLATERALS.find((c) => c.name === 'USDC');
  const decimals = currentCollateral?.decimals ?? 18;
  const { battles } = useBattles();
  const battle = battles?.find((battle) => battle.id === battleId);
  const strikeValue = battle?.bk?.strikeValue ?? 0n;

  const { data } = useBalances(battle);

  const spearBalance = data?.[1]?.result ?? 0n;
  const shieldBalance = data?.[2]?.result ?? 0n;
  const underlying = battle?.bk?.underlying ?? 'BTC';

  const { priceHistory } = usePriceStream(
    `https://hermes.pyth.network/v2/updates/price/stream?ids[]=${PYTH_FEED_IDS[underlying as UnderlyingType]}`,
    underlying,
  );

  const owned = spearBalance > 0n || shieldBalance > 0n;

  const [mode, setMode] = useState(0); // 0 => long, 1 => portfolio, 2=> close long

  useEffect(() => {
    setMode(owned ? 1 : 0);
  }, [owned]);

  const expires = Number(battle?.bk.expiries) * 1000;

  return (
    <div
      className={`grid grid-cols-3 gap-6 bg-cyan border-4 border-black p-6 rounded-b-xl drop-md-shadow -mt-[2px] w-full font-roboto ${show ? '' : 'hidden'}`}
    >
      <div className={'col-span-2'}>
        <div className={'px-4 py-6 border-[3px] border-black rounded-2xl bg-white mb-6'}>
          <div className="flex mb-6">
            <div className={'border-2 border-primary rounded-l-lg px-4 py-1 font-chela bg-black text-white text-2xl'}>
              {expires > 0 && <Countdown date={expires} renderer={renderer} />}
            </div>
            <div className={'border-2 border-primary -ml-[2px] rounded-r-lg font-roboto flex items-center px-4 gap-2'}>
              <ClockIcon width={20} height={20} />
              {dayjs(expires).format('MMMM D, YYYY')}
            </div>
          </div>
          <PriceChart data={priceHistory} targetPrice={formatBalance(strikeValue, 18, 2)} />
        </div>

        <div className="bg-white px-12 py-8 border-[3px] border-black rounded-2xl text-center">
          If {battle?.bk.underlying} settles above target, <span className={'text-primary font-semibold'}>UP</span> wins
          and pays 1 USDT, otherwise <span className={'text-danger font-semibold'}>DOWN</span> wins and pays 1 USDT. Say
          Goodbye to liquidation!
        </div>
      </div>

      <div className={'col-span-1 border-[3px] border-black p-6 bg-white rounded-xl'}>
        {mode === 0 && <LongCard setMode={setMode} owned={owned} />}
        {mode === 1 && (
          <LongPortfolio
            battleId={battle?.id as Address}
            setMode={setMode}
            callAmount={spearBalance}
            putAmount={shieldBalance}
            decimals={decimals}
          />
        )}
        {mode === 2 && (
          <CloseLong
            battleId={battle?.id as Address}
            setMode={setMode}
            callAmount={spearBalance}
            putAmount={shieldBalance}
            decimals={decimals}
          />
        )}
      </div>
    </div>
  );
};
