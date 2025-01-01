import { POSITION_MANAGER_ADDRESS } from '@/constants/contracts';
import { PositionManagerAbi } from '@/constants/abis/position-manager';
import { waitForTransactionReceipt } from '@wagmi/core';
import { config } from '@/app/providers';
import { useWriteContract } from 'wagmi';
import { useState } from 'react';

export const useRedeemObligation = (tokenId: bigint, callback?: () => void) => {
  const [redeeming, setRedeeming] = useState(false);
  const { writeContractAsync } = useWriteContract();

  const redeemObligation = async () => {
    setRedeeming(true);
    try {
      const hash = await writeContractAsync?.({
        address: POSITION_MANAGER_ADDRESS,
        abi: PositionManagerAbi,
        functionName: 'redeemObligation',
        args: [tokenId],
      });
      await waitForTransactionReceipt(config, { hash });
      callback?.();
    } catch (e) {
      console.error(e);
    }
    setRedeeming(false);
  };

  return {
    redeeming,
    redeemObligation,
  };
};
