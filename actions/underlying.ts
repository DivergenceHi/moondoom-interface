'use server';

import { HOST } from '@/constants';

export const getUnderlyings = async () => {
  return ['BTC', 'ETH/BTC', 'SOL/ETH'];
};

export const getUnderlyingPrice = async (underlying: string) => {
  return fetch(`${HOST}/underlyingPrice?underlying=${underlying}`).then((r) => r.json());
};
