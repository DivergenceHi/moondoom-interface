import { COLLATERALS } from '@/constants/collaterals';
import { TriangleDownIcon, TriangleUpIcon } from '@radix-ui/react-icons';
import dayjs from 'dayjs';
import { formatBalance } from '@/lib/format';
import { useLongPositions } from '@/hooks/use-long-positions';

export const PortfolioPositions = () => {
  const { longPositions } = useLongPositions();

  return (
    <>
      <div
        className="flex bg-[#161616] font-bold text-white px-6 py-2 rounded-t-2xl border-2 border-black"
        style={{
          boxShadow: 'inset 0px 4px 17px #005849',
        }}
      >
        <div className={'w-[80px]'}>Type</div>
        <div className={'w-[120px] text-center'}>Coin</div>
        <div className={'w-[140px] text-center'}>Expiry</div>
        <div className={'w-[120px] text-center'}>Size</div>
        <div className={'w-[120px] text-center'}>Entry Price</div>
        <div className={'w-[110px] text-center'}>Cost</div>
        <div className={'w-[140px] text-center'}>Expected P/L</div>
      </div>
      <div className="bg-white rounded-b-2xl border-2 border-black pt-2 pb-6">
        {longPositions?.length === 0 && (
          <div className="flex justify-center items-center h-40">
            <div className="">No positions</div>
          </div>
        )}
        {longPositions?.map((position) => {
          const collateral = COLLATERALS.find((c) => c.address === position.battle.bk.collateral);
          return (
            <div key={position.battle.id}>
              <div className={'flex items-center px-6 py-2'}>
                <div className={'w-[80px] text-dark-primary'}>LONG</div>
                <div className={'w-[120px] flex justify-center items-center'}>
                  {position.battle.bk.underlying}/USD
                  {position.isCall ? (
                    <TriangleUpIcon width={20} height={20} className={'text-dark-primary'} />
                  ) : (
                    <TriangleDownIcon width={20} height={20} className={'text-dark-danger'} />
                  )}
                </div>
                <div className={'w-[140px] text-center'}>
                  {dayjs(Number(position.battle.bk.expiries) * 1000).format('MMM DD, YYYY')}
                </div>
                <div className={'w-[120px] text-center'}>{formatBalance(position.amount, collateral?.decimals)}</div>
                <div className={'w-[120px] text-center'}>{formatBalance(position.entryPrice, 18)}</div>
                <div className={'w-[110px] text-center'}>{formatBalance(position.cost, collateral?.decimals)}</div>
                <div className={'w-[140px] text-center'}>+395 USDT</div>
                <div className={'flex justify-end  grow shrink-0 text-sm font-chela'}>
                  <button className={'text-dark-primary border border-primary rounded-xl px-3'}>Early Close</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};
