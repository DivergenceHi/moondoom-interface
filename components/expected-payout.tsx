import { RiskIcon } from '@/components/icons/risk';
import { formatBalance } from '@/lib/format';

export const ExpectedPayout = ({ payout }: { payout: bigint }) => {
  console.log(payout);
  return (
    <div className={'flex flex-col items-center'}>
      <div className={'text-center'}>Expected Payout</div>
      <div className={'font-chela text-primary text-md-border text-5xl drop-shadow-md text-center leading-6'}>
        {payout <= 0n && <>--%</>}
        {payout > 0n && <>+{formatBalance(payout, 2, 2)}%</>}
      </div>
      <div className="flex items-start gap-2 mt-4 text-xs">
        <RiskIcon />
        No Liquidation Risks
      </div>
    </div>
  );
};
