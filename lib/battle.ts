import { findCorrectTick } from './tickAndPrice';
import { BigNumber } from 'bignumber.js';
import { X96 } from '@divergence-protocol/diver-sdk';

export const getSqrtPriceX96FromTickV3 = (tick: number): BigNumber => {
  const p = new BigNumber(1.00004999875).pow(tick);

  return p.multipliedBy(X96);
};

export const getSqrtPriceX96FromMin = (isSpear: boolean, min: string) => {
  if (isSpear) {
    const rp = 1 - Number(min);
    const rt = findCorrectTick(rp.toString());
    return getSqrtPriceX96FromTickV3(Number(rt) + 1).toFixed(0);
  } else {
    return getSqrtPriceX96FromTickV3(Number(findCorrectTick(min)) - 1).toFixed(0);
  }
};
