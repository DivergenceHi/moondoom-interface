import { useAccount, useReadContracts } from 'wagmi';
import { Address, erc20Abi } from 'viem';
import { Battle } from '@/types/battle';
import { COLLATERALS } from '@/constants/collaterals';
import { POSITION_MANAGER_ADDRESS } from '@/constants/contracts';

export const useBalances = (battle: Battle | undefined) => {
  const currentCollateral = COLLATERALS.find((c) => c.name === 'USDC');
  const { address } = useAccount();
  return useReadContracts({
    contracts: [
      {
        abi: erc20Abi,
        address: currentCollateral?.address,
        functionName: 'balanceOf',
        args: [address as Address],
      },
      {
        abi: erc20Abi,
        address: battle?.spearAddress,
        functionName: 'balanceOf',
        args: [address as Address],
      },
      {
        abi: erc20Abi,
        address: battle?.shieldAddress,
        functionName: 'balanceOf',
        args: [address as Address],
      },
      {
        abi: erc20Abi,
        address: currentCollateral?.address,
        functionName: 'allowance',
        args: [address as Address, POSITION_MANAGER_ADDRESS],
      },
      {
        abi: erc20Abi,
        address: battle?.spearAddress,
        functionName: 'allowance',
        args: [address as Address, POSITION_MANAGER_ADDRESS],
      },
      {
        abi: erc20Abi,
        address: battle?.shieldAddress,
        functionName: 'allowance',
        args: [address as Address, POSITION_MANAGER_ADDRESS],
      },
    ],
  });
};
