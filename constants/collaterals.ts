import { base } from 'viem/chains';
import { Collateral } from '@/types/collateral';

export const COLLATERALS: Collateral[] = [
  {
    name: 'USDC',
    chainId: base.id,
    address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    decimals: 6,
  },
];
