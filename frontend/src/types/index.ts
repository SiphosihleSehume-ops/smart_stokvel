import type { Address } from "viem";

export type UserProfile = {
  profileHash: string;
  registeredAt: bigint;
};

export enum PoolState {
  Active = 0,
  Dissolved = 1,
}

export type PoolSummary = {
  address: Address;
  creator: Address;
  assetToken: Address;
  contributionAmount: bigint;
  durationPerRound: bigint;
  members: Address[];
};

export type PoolDetails = PoolSummary & {
  poolState: PoolState;
  totalMembers: bigint;
  currentRound: bigint;
};
