import { Address, erc20Abi } from 'viem';
import { waitForTransactionReceipt } from '@wagmi/core';
import { config } from '@/app/providers';
import { useState } from 'react';
import { useWriteContract } from 'wagmi';

export const useApprove = (
  tokenAddress: Address | undefined,
  spender: Address,
  amount: bigint,
  callback?: () => void,
) => {
  const [approving, setApproving] = useState(false);
  const { writeContractAsync } = useWriteContract();

  const approve = async () => {
    setApproving(true);
    try {
      const hash = await writeContractAsync?.({
        address: tokenAddress as Address,
        abi: erc20Abi,
        functionName: 'approve',
        args: [spender, amount],
      });
      await waitForTransactionReceipt(config, { hash });
      callback?.();
    } catch (e) {
      console.error(e);
    }
    setApproving(false);
  };

  return {
    approving,
    approve,
  };
};
