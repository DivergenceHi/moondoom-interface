import { UpIcon } from '@/components/icons/up';
import { DownIcon } from '@/components/icons/down';
import { formatBalance, formatUSD } from '@/lib/format';
import { Address } from 'viem';
import { useLongPortfolioData } from '@/hooks/use-long-portfolio-data';

export const LongPortfolio = ({
  battleId,
  setMode,
  callAmount,
  putAmount,
  decimals,
}: {
  battleId: Address;
  setMode: (mode: number) => void;
  callAmount: bigint;
  putAmount: bigint;
  decimals: number;
}) => {
  const { isUp, avgEntryPrice, netAmount, cost, payout, isLoss, plAmount } = useLongPortfolioData(
    battleId,
    decimals,
    callAmount,
    putAmount,
  );

  return (
    <div>
      <div className={'font-roboto flex justify-center mb-1 text-sm'}>
        <strong className={'italic mr-2 inline-block'}>Net Exposure:</strong> Long&nbsp;
        {formatBalance(netAmount, decimals, 4)} {isUp ? 'UP' : 'DOWN'}
      </div>
      <div className="flex items-center gap-4">
        <UpIcon />
        <div className={'border border-black h-[10px] w-full bg-[#464646] rounded-full'} />
        <DownIcon />
      </div>
      <div className="flex items-center justify-between mt-1 text-sm">
        <div>Long {formatBalance(callAmount, decimals, 4)} UP</div>
        <div>Long {formatBalance(putAmount, decimals, 4)} DOWN</div>
      </div>

      <div className={'my-12'}>
        <div className={'text-3xl font-semibold font-roboto text-center'}>Expected Payout</div>
        <div className={'text-primary text-center text-8xl -mt-4 font-chela text-md-border'}>+{payout / 100n}%</div>
      </div>

      <div className="flex justify-between mt-20">
        <div>Avg. Entry Price</div>
        <div>{formatUSD(formatBalance(avgEntryPrice, 18, 4))}</div>
      </div>
      <div className="flex justify-between">
        <div>Total Cost</div>
        <div>${formatBalance(cost, decimals, 4)}</div>
      </div>
      <div className="flex justify-between">
        <div className={'font-bold'}>Expected P/L</div>
        {isLoss ? (
          <div className={'text-danger'}>-${formatBalance(plAmount, decimals, 4)}</div>
        ) : (
          <div className={'text-primary'}>+${formatBalance(plAmount, decimals, 4)}</div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 mt-20">
        <button className={'btn-md-primary'} onClick={() => setMode(0)}>
          Buy More
        </button>
        <button className={'btn-md-danger'} disabled={netAmount === 0n} onClick={() => setMode(2)}>
          Early Close
        </button>
      </div>
    </div>
  );
};
