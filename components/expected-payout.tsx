import { RiskIcon } from '@/components/icons/risk';

export const ExpectedPayout = ({ payout }: { payout: number }) => {
  return (
    <div className={'flex flex-col items-center'}>
      <div className={'text-center'}>Expected Payout</div>
      <div className={'font-chela text-primary text-md-border text-5xl drop-shadow-md text-center leading-6'}>
        +{payout}%
      </div>
      <div className="flex items-center gap-2 mt-4">
        <RiskIcon />
        No Liquidation Risks
      </div>
    </div>
  );
};
