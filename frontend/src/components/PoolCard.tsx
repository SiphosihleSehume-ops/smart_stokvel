"use client";

import Link from "next/link";
import type { Address } from "viem";
import { usePoolDetails } from "@/hooks/useStockvelPool";
import { formatTokenAmount, shortenAddress } from "@/utils/formatters";
import { PoolState } from "@/types";

export function PoolCard({ address }: { address: Address }) {
  const { details, isLoading } = usePoolDetails(address);

  if (isLoading || !details) {
    return (
      <div className="animate-pulse rounded-xl bg-white p-6 shadow-sm">
        <div className="h-4 w-1/2 rounded bg-gray-200" />
        <div className="mt-3 h-3 w-1/3 rounded bg-gray-200" />
      </div>
    );
  }

  return (
    <Link
      href={`/pools/${address}`}
      className="block rounded-xl bg-white p-6 shadow-sm transition hover:shadow-md"
    >
      <div className="flex items-center justify-between">
        <p className="font-mono text-sm text-gray-700">{shortenAddress(address)}</p>
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
            details.poolState === PoolState.Active
              ? "bg-stokvel-100 text-stokvel-700"
              : "bg-gray-200 text-gray-600"
          }`}
        >
          {details.poolState === PoolState.Active ? "Active" : "Dissolved"}
        </span>
      </div>
      <p className="mt-3 text-lg font-semibold">
        {formatTokenAmount(details.contributionAmount)} / round
      </p>
      <p className="mt-1 text-sm text-gray-500">
        Round {details.currentRound.toString()} of {details.totalMembers.toString()} ·{" "}
        {details.members.length} members
      </p>
    </Link>
  );
}
