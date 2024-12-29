import { useAccount, useReadContract } from 'wagmi';
import { Address } from 'viem';
import { QuoterABI } from '@/constants/abis/quoter';
import { QUOTER_ADDRESS } from '@/constants/contracts';

export const useUserShortPositions = () => {
  const { address } = useAccount();

  return useReadContract({
    address: QUOTER_ADDRESS,
    abi: QuoterABI,
    functionName: 'accountPositions',
    args: [address as Address],
  });
};
