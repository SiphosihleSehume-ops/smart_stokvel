"use client";

import {
  useAccount,
  useReadContract,
  useReadContracts,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import type { Address } from "viem";
import StokvelPoolAbi from "@/contracts/abis/StockvelPool.json";
import { PoolState } from "@/types";

/** Core read data for a single pool: asset token, contribution amount, round info, state. */
export function useStockvelPool(poolAddress?: Address) {
  const contracts = [
    {
      address: poolAddress,
      abi: StokvelPoolAbi,
      functionName: "assetToken",
    },
    {
      address: poolAddress,
      abi: StokvelPoolAbi,
      functionName: "contributionAmount",
    },
    {
      address: poolAddress,
      abi: StokvelPoolAbi,
      functionName: "durationPerRound",
    },
    {
      address: poolAddress,
      abi: StokvelPoolAbi,
      functionName: "currentRound",
    },
    {
      address: poolAddress,
      abi: StokvelPoolAbi,
      functionName: "roundStartedAt",
    },
    {
      address: poolAddress,
      abi: StokvelPoolAbi,
      functionName: "totalMembers",
    },
    {
      address: poolAddress,
      abi: StokvelPoolAbi,
      functionName: "poolState",
    },
  ] as const;

  const { data, isLoading, isError, refetch } = useReadContracts({
    contracts,
    query: { enabled: Boolean(poolAddress) },
  });

  const [
    assetToken,
    contributionAmount,
    durationPerRound,
    currentRound,
    roundStartedAt,
    totalMembers,
    poolState,
  ] = data ?? [];

  return {
    assetToken: assetToken?.result as Address | undefined,
    contributionAmount: contributionAmount?.result as bigint | undefined,
    durationPerRound: durationPerRound?.result as bigint | undefined,
    currentRound: currentRound?.result as bigint | undefined,
    roundStartedAt: roundStartedAt?.result as bigint | undefined,
    totalMembers: totalMembers?.result as bigint | undefined,
    poolState: poolState?.result as PoolState | undefined,
    isLoading,
    isError,
    refetch,
  };
}

/** Full member list for the pool. */
export function usePoolMembers(poolAddress?: Address) {
  return useReadContract({
    address: poolAddress,
    abi: StokvelPoolAbi,
    functionName: "getMembers",
    query: { enabled: Boolean(poolAddress) },
  });
}

/** Whether a given address (defaults to the connected wallet) is a member of the pool. */
export function useIsPoolMember(poolAddress?: Address, account?: Address) {
  const { address } = useAccount();
  const target = account ?? address;

  return useReadContract({
    address: poolAddress,
    abi: StokvelPoolAbi,
    functionName: "isMember",
    args: target ? [target] : undefined,
    query: { enabled: Boolean(poolAddress && target) },
  });
}

/** Whether a given address (defaults to the connected wallet) has contributed in a given round. */
export function useHasContributed(
  poolAddress?: Address,
  round?: bigint,
  account?: Address
) {
  const { address } = useAccount();
  const target = account ?? address;

  return useReadContract({
    address: poolAddress,
    abi: StokvelPoolAbi,
    functionName: "hasContributed",
    args: round !== undefined && target ? [round, target] : undefined,
    query: { enabled: Boolean(poolAddress && round !== undefined && target) },
  });
}

/** Total amount contributed so far in a given round. */
export function useContributionsInRound(poolAddress?: Address, round?: bigint) {
  return useReadContract({
    address: poolAddress,
    abi: StokvelPoolAbi,
    functionName: "contributionsInRound",
    args: round !== undefined ? [round] : undefined,
    query: { enabled: Boolean(poolAddress && round !== undefined) },
  });
}

/**
 * Sends the caller's contribution for the current round.
 * Note: the token must already be approved for this pool's address
 * (see `useApproveToken` in useToken.ts) before calling `contribute`.
 */
export function useContribute(poolAddress?: Address) {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash });

  function contribute() {
    if (!poolAddress) return;
    writeContract({
      address: poolAddress,
      abi: StokvelPoolAbi,
      functionName: "contribute",
    });
  }

  return { contribute, hash, isPending, isConfirming, isConfirmed, error };
}