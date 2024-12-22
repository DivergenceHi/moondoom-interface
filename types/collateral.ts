import { Address } from 'viem';

export interface Collateral {
  name: string;
  chainId: number;
  address: Address;
  decimals: number;
}
