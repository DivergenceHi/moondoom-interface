import { TickAndPrice } from '../constants/tickAndPrice';
import { BigNumber } from 'bignumber.js';

export const PriceMin = 0.010023;
export const PriceMax = 0.989977;

export const isShieldPriceRight = (price: string) => TickAndPrice.findIndex((tp) => tp.p === price);

export const findCorrectPrice = (price: string) => {
  for (let i = 0; i < TickAndPrice.length; i++) {
    if (new BigNumber(price).lte(TickAndPrice[i].p)) {
      return TickAndPrice[i].p;
    }
  }
  return String(PriceMax);
};

export const findNextCorrectPrice = (price: string) => {
  const finalPrice = findCorrectPrice(price);
  const i = TickAndPrice.findIndex((tp) => new BigNumber(tp.p).eq(finalPrice));
  if (i === -1) {
    return PriceMax.toFixed();
  }

  return i + 1 >= TickAndPrice.length ? PriceMax.toFixed() : TickAndPrice[i + 1].p;
};

export const findPreviousCorrectPrice = (price: string) => {
  const finalPrice = findCorrectPrice(price);
  const i = TickAndPrice.findIndex((tp) => new BigNumber(tp.p).eq(finalPrice));
  if (i === -1) {
    return PriceMin.toFixed();
  }

  return i - 1 < 0 ? PriceMin.toFixed() : TickAndPrice[i - 1].p;
};

export const findCorrectTick = (price: string) => {
  const finalPrice = findCorrectPrice(price);
  return TickAndPrice.find((tp) => tp.p === finalPrice)?.t;
};
