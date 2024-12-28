'use server';

import { HOST } from '@/constants';

export const getBattles = async () => {
  return fetch(`${HOST}/battles`).then((r) => r.json());
};
