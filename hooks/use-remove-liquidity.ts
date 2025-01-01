import { POSITION_MANAGER_ADDRESS } from '@/constants/contracts';
import { PositionManagerAbi } from '@/constants/abis/position-manager';
import { waitForTransactionReceipt } from '@wagmi/core';
import { config } from '@/app/providers';
import { useWriteContract } from 'wagmi';
import { useState } from 'react';

export const useRemoveLiquidity = (tokenId: bigint, callback?: () => void) => {
  const [removing, setRemoving] = useState(false);
  const { writeContractAsync } = useWriteContract();

  const removeLiquidity = async () => {
    setRemoving(true);
    try {
      const hash = await writeContractAsync?.({
        address: POSITION_MANAGER_ADDRESS,
        abi: PositionManagerAbi,
        functionName: 'removeLiquidity',
        args: [tokenId],
      });
      await waitForTransactionReceipt(config, { hash });
      callback?.();
    } catch (e) {
      console.error(e);
    }
    setRemoving(false);
  };

  return {
    removing,
    removeLiquidity,
  };
};
