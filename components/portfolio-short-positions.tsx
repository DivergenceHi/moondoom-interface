import { useShortPositions } from '@/hooks/use-short-positions';
import { COLLATERALS } from '@/constants/collaterals';
import { TriangleDownIcon, TriangleUpIcon } from '@radix-ui/react-icons';
import { formatExpiry } from '@/lib/date';
import { formatBalance } from '@/lib/format';

export const PortfolioShortPositions = () => {
  const { shortPositions } = useShortPositions();

  console.log(shortPositions);
  // const filterShortPositions = useMemo(
  //   () =>
  //     shortPositions?.filter(
  //       (s) => s.positionState === PositionState.LiquidityAdded && !s?.battle?.battleKey.underlying.includes('ETF'),
  //     ),
  //   [shortPositions],
  // );
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
        <div className={'w-[120px] text-center'}>Short Price</div>
        <div className={'w-[110px] text-center'}>Premium</div>
        <div className={'w-[110px] text-center'}>Fees</div>
      </div>
      <div className="bg-white rounded-b-2xl border-2 border-black pt-2 pb-6">
        {shortPositions?.length === 0 && (
          <div className="flex justify-center items-center h-40">
            <div className="">No positions</div>
          </div>
        )}
        {shortPositions?.map((position) => {
          const collateral = COLLATERALS.find((c) => c.address === position.battle.bk.collateral);
          return (
            <div key={position.tokenId}>
              <div className={'flex items-center px-6 py-2'}>
                <div className={'w-[120px] flex justify-center items-center'}>
                  {position?.battle?.bk.underlying}/USD
                  {position.isCall ? (
                    <TriangleUpIcon width={20} height={20} className={'text-dark-primary'} />
                  ) : (
                    <TriangleDownIcon width={20} height={20} className={'text-dark-danger'} />
                  )}
                </div>
                <div className={'w-[200px] text-center'}>{formatExpiry(position.battle.bk.expiry)}</div>
                <div className={'w-[120px] text-center'}>{formatBalance(position.liquidity, collateral?.decimals)}</div>
                <div className={'w-[120px] text-center'}>{formatBalance(0n, collateral?.decimals)}</div>
                <div className={'w-[120px] text-center'}>
                  {formatBalance(position.owed.collateralIn, collateral?.decimals)}
                </div>
                <div className={'w-[110px] text-center'}>0</div>
                <div className={'w-[140px] text-center'}>{formatBalance(0n, collateral?.decimals)}</div>
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
