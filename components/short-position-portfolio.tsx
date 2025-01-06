import clsx from 'clsx';
import { ShortPosition } from '@/types/position';
import { getPriceFromTick, getTickFromSqrtPriceX96 } from '@divergence-protocol/diver-sdk';
import { COLLATERALS } from '@/constants/collaterals';
import { formatBalance } from '@/lib/format';
import { UpIcon } from '@/components/icons/up';
import { DownIcon } from '@/components/icons/down';
import { VersusBar } from '@/components/versus-bar';

export const ShortPositionPortfolio = ({ position }: { position: ShortPosition }) => {
  const currentCollateral = COLLATERALS?.find(
    (c) => c.address.toLowerCase() === position?.battle?.bk?.collateral?.toLowerCase(),
  );
  const collateralSymbol = currentCollateral?.name;
  const decimals = currentCollateral?.decimals ?? 18;
  // const shieldPrice = getPriceFromSqrtPriceX96(battle.battle_info.sqrt_price_x96);
  const tick = Number(getTickFromSqrtPriceX96(position?.battle?.sqrtPriceX96.toString() ?? '0'));
  const min = getPriceFromTick(position.tickLower);
  const max = getPriceFromTick(position.tickUpper);

  const callAmount = position?.owed?.spearOut;
  const putAmount = position?.owed?.shieldOut;
  const isUp = callAmount > putAmount;
  const mode = tick > position.tickLower && tick < position.tickUpper ? 2 : isUp ? 0 : 1;

  const netAmount = isUp ? callAmount - putAmount : putAmount - callAmount;

  return (
    <div>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className={'flex flex-col items-center'}>
          <div className={'font-roboto'}>Collateral</div>
          <div className={'font-semibold text-lg'}>
            {formatBalance(position?.seed, decimals, 4)} {collateralSymbol}
          </div>
        </div>
        <div className={'flex flex-col items-center'}>
          <div className={'font-roboto'}>Premium</div>
          <div className={'font-semibold text-lg'}>
            {formatBalance(position?.owed?.collateralIn, decimals, 4)} {collateralSymbol}
          </div>
        </div>
        <div className={'flex flex-col items-center'}>
          <div className={'font-roboto'}>Fees</div>
          <div className={'font-semibold text-lg'}>
            {formatBalance(position?.owed?.fee, decimals, 4)} {collateralSymbol}
          </div>
        </div>
      </div>
      <button
        className={clsx('short-range-item', {
          'bg-md-gradient-primary active': mode === 1,
        })}
      >
        <div>Short Up</div>
        <div>
          {min.toFixed(2)} - {max.toFixed(2)}
        </div>
      </button>
      <button
        className={clsx('short-range-item', {
          'bg-md-gradient-primary active': mode === 0,
        })}
      >
        <div>Short Down</div>
        <div>
          {min.toFixed(2)} - {max.toFixed(2)}
        </div>
      </button>
      <button
        className={clsx('short-range-item', {
          'bg-md-gradient-primary active': mode === 2,
        })}
      >
        <div>Dual Liquidity</div>
        <div>
          {min.toFixed(2)} - {max.toFixed(2)}
        </div>
      </button>

      <div className={'font-roboto flex justify-center mb-1 text-sm my-10'}>
        <strong className={'italic mr-2 inline-block'}>Net Exposure:</strong> Short&nbsp;
        {formatBalance(netAmount, decimals, 4)} {isUp ? 'UP' : 'DOWN'}
      </div>
      <div className="flex items-center gap-4">
        <UpIcon />
        <VersusBar callAmount={callAmount} putAmount={putAmount} />
        <DownIcon />
      </div>
      <div className="flex items-center justify-between mt-1 text-sm">
        <div>Short {formatBalance(callAmount, decimals, 4)} UP</div>
        <div>Short {formatBalance(putAmount, decimals, 4)} DOWN</div>
      </div>
    </div>
  );
};
