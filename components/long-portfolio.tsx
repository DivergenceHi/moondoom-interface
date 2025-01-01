import { UpIcon } from '@/components/icons/up';
import { DownIcon } from '@/components/icons/down';
import { formatBalance, formatUSD } from '@/lib/format';
import { Address } from 'viem';
import { useLongPortfolioData } from '@/hooks/use-long-portfolio-data';
import { VersusBar } from '@/components/versus-bar';
import { RiskIcon } from '@/components/icons/risk';

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
      <div className="flex items-center gap-1">
        <UpIcon />
        <VersusBar callAmount={callAmount} putAmount={putAmount} />
        <DownIcon />
      </div>
      <div className="flex items-center justify-between mt-1 text-sm">
        <div>Long {formatBalance(callAmount, decimals, 4)} UP</div>
        <div>Long {formatBalance(putAmount, decimals, 4)} DOWN</div>
      </div>

      <div className={'my-12'}>
        <div className={'text-3xl font-semibold font-roboto text-center'}>Expected Payout</div>
        <div className={'text-primary text-center text-8xl -mt-6 font-chela text-md-border'}>+{payout / 100n}%</div>
        <div className="flex items-center gap-2 mt-1 text-xs justify-center">
          <RiskIcon />
          No Liquidation Risks
        </div>
      </div>

      <div className={'mt-6 text-sm'}>
        <div className="flex justify-between mt-20">
          <div>Avg. Entry Price</div>
          <div>{formatUSD(formatBalance(avgEntryPrice, 18, 4))}</div>
        </div>
        <div className="flex justify-between">
          <div>Total Cost</div>
          <div>${formatBalance(cost, decimals, 4)}</div>
        </div>
        <div className="flex justify-between font-bold">
          <div>Expected P/L</div>
          {isLoss ? (
            <div className={'text-dark-danger'}>-${formatBalance(plAmount, decimals, 4)}</div>
          ) : (
            <div className={'text-dark-primary'}>+${formatBalance(plAmount, decimals, 4)}</div>
          )}
        </div>
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
