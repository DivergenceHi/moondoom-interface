import { UpIcon } from '@/components/icons/up';
import { DownIcon } from '@/components/icons/down';
import { formatBalance } from '@/lib/format';
import { WAD } from '@/constants';
import { useQuery } from '@apollo/client';
import { GET_USER_TRADES } from '@/graphql/trades';
import { useAccount } from 'wagmi';
import { parseUnits } from 'viem';

export const LongPortfolio = ({
  battleId,
  setMode,
  callAmount,
  putAmount,
  decimals,
}: {
  battleId: string | undefined;
  setMode: (mode: number) => void;
  callAmount: bigint;
  putAmount: bigint;
  decimals: number;
}) => {
  const { address } = useAccount();
  const isUp = callAmount > putAmount;
  const netAmount = isUp ? callAmount - putAmount : putAmount - callAmount;

  const { data } = useQuery(GET_USER_TRADES, {
    variables: {
      sender: address?.toLocaleLowerCase(),
      battle: battleId?.toLocaleLowerCase(),
    },
  });

  const trades = data?.trades;
  const costAmount: bigint =
    trades?.reduce((acc: bigint, trade: { amountIn: string }) => acc + parseUnits(trade.amountIn, decimals), 0n) ?? 0n;

  const maxAmount = callAmount > putAmount ? callAmount : putAmount;
  const isLoss = maxAmount < costAmount;
  const plAmount = isLoss ? costAmount - maxAmount : maxAmount - costAmount;
  const avgCost = netAmount > 0n ? WAD - (plAmount * WAD) / netAmount : 0n;

  console.log('trades', trades, costAmount);

  const payout = costAmount > 0n ? (maxAmount * 10000n) / costAmount - 10000n : 0n;
  console.log(maxAmount, costAmount);

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

      <div className={'my-16'}>
        <div className={'text-3xl font-semibold font-roboto text-center'}>Expected Payout</div>
        <div className={'text-primary text-center text-8xl -mt-4 font-chela text-md-border'}>+{payout / 100n}%</div>
      </div>

      <div className="flex justify-between mt-20">
        <div>Avg. entry cost</div>
        <div>${formatBalance(avgCost, 18, 4)}</div>
      </div>
      <div className="flex justify-between">
        <div>Total cost</div>
        <div>${formatBalance(costAmount, decimals, 4)}</div>
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
