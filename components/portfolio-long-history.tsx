import { COLLATERALS } from '@/constants/collaterals';
import { TriangleDownIcon, TriangleUpIcon } from '@radix-ui/react-icons';
import { formatBalance } from '@/lib/format';
import { useLongPositions } from '@/hooks/use-long-positions';
import { formatExpiry } from '@/lib/date';

export const PortfolioLongHistory = () => {
  const { longPositions } = useLongPositions();

  return (
    <>
      <div
        className="flex bg-[#161616] font-bold text-white px-6 py-2 rounded-t-2xl border-2 border-black"
        style={{
          boxShadow: 'inset 0px 4px 17px #005849',
        }}
      >
        <div className={'w-[120px] text-center'}>Coin</div>
        <div className={'w-[200px] text-center'}>Expiry</div>
        <div className={'w-[120px] text-center'}>Size</div>
        <div className={'w-[120px] text-center'}>Entry Price</div>
        <div className={'w-[110px] text-center'}>Cost</div>
        <div className={'w-[140px] text-center'}>Expected P/L</div>
      </div>
      <div className="bg-white rounded-b-2xl border-2 border-black pt-2 pb-6">
        {longPositions?.length && (
          <div className="flex justify-center items-center h-40">
            <div className="">No positions</div>
          </div>
        )}
      </div>
    </>
  );
};
