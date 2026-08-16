"use client";

import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import type { Address } from "viem";
import ERC20Abi from "@/contracts/abis/ERC20.json";

/** Reads the connected wallet's balance and its allowance for a given spender (e.g. a pool). */
export function useTokenAllowance(tokenAddress?: Address, spender?: Address) {
  const { address } = useAccount();

  return useReadContract({
    address: tokenAddress,
    abi: ERC20Abi,
    functionName: "allowance",
    args: address && spender ? [address, spender] : undefined,
    query: { enabled: Boolean(tokenAddress && address && spender) },
  });
}

export function useTokenBalance(tokenAddress?: Address, account?: Address) {
  const { address } = useAccount();
  const target = account ?? address;

  return useReadContract({
    address: tokenAddress,
    abi: ERC20Abi,
    functionName: "balanceOf",
    args: target ? [target] : undefined,
    query: { enabled: Boolean(tokenAddress && target) },
  });
}

/** Approves a spender (e.g. a StokvelPool) to pull `amount` of an ERC-20 token. */
export function useApproveToken(tokenAddress?: Address) {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  function approve(spender: Address, amount: bigint) {
    if (!tokenAddress) return;
    writeContract({
      address: tokenAddress,
      abi: ERC20Abi,
      functionName: "approve",
      args: [spender, amount],
    });
  }

  return { approve, hash, isPending, isConfirming, isConfirmed, error };
}
