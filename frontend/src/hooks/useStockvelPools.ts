"use client";

import { useReadContract, useReadContracts, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import type { Address } from "viem";
import StokvelPoolAbi from "@/contracts/abis/StokvelPool.json";
import StockvelFactoryAbi from "@/contracts/abis/StockvelFactory.json";
import { STOCKVEL_FACTORY_ADDRESS } from "@/contracts/addresses";
import type { PoolDetails } from "@/types";

/** Reads the full list of pool addresses deployed through the StockvelFactory. */
export function useAllPools() {
  return useReadContract({
    address: STOCKVEL_FACTORY_ADDRESS,
    abi: StockvelFactoryAbi,
    functionName: "getAllPools",
  });
}

/** Deploys a new StokvelPool through the factory. */
export function useCreatePool() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  function createPool(
    assetToken: Address,
    contributionAmount: bigint,
    durationPerRound: bigint,
    members: Address[],
  ) {
    writeContract({
      address: STOCKVEL_FACTORY_ADDRESS,
      abi: StockvelFactoryAbi,
      functionName: "createPool",
      args: [assetToken, contributionAmount, durationPerRound, members],
    });
  }

  return { createPool, hash, isPending, isConfirming, isConfirmed, error };
}

/** Reads the full on-chain state for a single pool in one batched call. */
export function usePoolDetails(poolAddress?: Address) {
  const contract = { address: poolAddress as Address, abi: StokvelPoolAbi as readonly unknown[] };

  const { data, isLoading, error, refetch } = useReadContracts({
    contracts: [
      { ...contract, functionName: "registry" },
      { ...contract, functionName: "assetToken" },
      { ...contract, functionName: "contributionAmount" },
      { ...contract, functionName: "durationPerRound" },
      { ...contract, functionName: "poolState" },
      { ...contract, functionName: "totalMembers" },
      { ...contract, functionName: "currentRound" },
      { ...contract, functionName: "getMembers" },
    ],
    query: { enabled: Boolean(poolAddress) },
  });

  const details: PoolDetails | undefined =
    data && poolAddress && data.every((d) => d.status === "success")
      ? {
          address: poolAddress,
          creator: (data[7].result as Address[])[0],
          assetToken: data[1].result as Address,
          contributionAmount: data[2].result as bigint,
          durationPerRound: data[3].result as bigint,
          poolState: data[4].result as number,
          totalMembers: data[5].result as bigint,
          currentRound: data[6].result as bigint,
          members: data[7].result as Address[],
        }
      : undefined;

  return { details, isLoading, error, refetch };
}

/** Contributes the pool's fixed `contributionAmount` for the current round. */
export function useContribute(poolAddress?: Address) {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

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
