import { Address } from 'viem';
import { useReadContracts } from 'wagmi';
import { BattleAbi } from '@/constants/abis/battle';

export const useBattle = (address: Address) => {
  const { data } = useReadContracts({
    contracts: [
      {
        abi: BattleAbi,
        address,
        functionName: 'slot0',
      },
      {
        abi: BattleAbi,
        address,
        functionName: 'spearAndShield',
      },
      {
        abi: BattleAbi,
        address,
        functionName: 'battleKey',
      },
    ],
  });

  console.log(data);
};
