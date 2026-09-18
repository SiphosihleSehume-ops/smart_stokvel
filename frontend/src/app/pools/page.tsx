"use client";

import { useAllPools } from "@/hooks/useStockvelPools";
import { PoolCard } from "@/components/PoolCard";
import type { Address } from "viem";

export default function PoolsPage() {
  const { data: pools, isLoading } = useAllPools();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Pools</h1>
      {isLoading && <p className="mt-4 text-gray-500">Loading pools…</p>}
      {!isLoading && (!pools || (pools as Address[]).length === 0) && (
        <p className="mt-4 text-gray-500">No pools yet. Create one to get started.</p>
      )}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {(pools as Address[] | undefined)?.map((address) => (
          <PoolCard key={address} address={address} />
        ))}
      </div>
    </div>
  );
}
