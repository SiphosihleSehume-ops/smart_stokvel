"use client";

import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import type { Address } from "viem";
import UserRegistryAbi from "@/contracts/abis/UserRegistry.json";
import { USER_REGISTRY_ADDRESS } from "@/contracts/addresses";

/**
 * Reads whether a given address (defaults to the connected account) is registered
 * in UserRegistry.
 */
export function useIsRegistered(address?: Address) {
  const { address: connectedAddress } = useAccount();
  const target = address ?? connectedAddress;

  return useReadContract({
    address: USER_REGISTRY_ADDRESS,
    abi: UserRegistryAbi,
    functionName: "isRegistered",
    args: target ? [target] : undefined,
    query: { enabled: Boolean(target) },
  }) as { data: boolean | undefined; refetch: () => void; isLoading: boolean };
}

/** Reads a user's stored profile hash + registration timestamp. */
export function useUserProfile(address?: Address) {
  const { address: connectedAddress } = useAccount();
  const target = address ?? connectedAddress;

  return useReadContract({
    address: USER_REGISTRY_ADDRESS,
    abi: UserRegistryAbi,
    functionName: "getUserProfile",
    args: target ? [target] : undefined,
    query: { enabled: Boolean(target) },
  });
}

/** Registers the connected wallet with the given identity/profile hash (e.g. an IPFS URI). */
export function useRegisterUser() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  function registerUser(identityHash: string) {
    writeContract({
      address: USER_REGISTRY_ADDRESS,
      abi: UserRegistryAbi,
      functionName: "registerUser",
      args: [identityHash],
    });
  }

  return { registerUser, hash, isPending, isConfirming, isConfirmed, error };
}
