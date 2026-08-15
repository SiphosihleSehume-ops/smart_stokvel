import type { Address } from "viem";

/**
 * Deployed contract addresses, sourced from the environment.
 * Populate these in `.env.local` after running the Foundry deploy scripts
 * (see contracts/script/DeployRegistry.s.sol and DeployStockvel.s.sol).
 */
export const USER_REGISTRY_ADDRESS = (process.env.NEXT_PUBLIC_USER_REGISTRY_ADDRESS ??
  "0x0000000000000000000000000000000000000000") as Address;

export const STOCKVEL_FACTORY_ADDRESS = (process.env.NEXT_PUBLIC_STOCKVEL_FACTORY_ADDRESS ??
  "0x0000000000000000000000000000000000000000") as Address;
