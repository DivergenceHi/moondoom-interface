import { base } from 'viem/chains';
import { Collateral } from '@/types/collateral';

export const COLLATERALS: Collateral[] = [
  {
    name: 'USDC',
    chainId: base.id,
    address: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
    decimals: 6,
  },
];
