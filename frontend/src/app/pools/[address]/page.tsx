"use client";

import { use } from "react";
import type { Address } from "viem";
import { usePoolDetails } from "@/hooks/useStockvelPools";
import { useContributionsInRound } from "@/hooks/useStockvelPool";
import { ContributeButton } from "@/components/ContributeButton";
import { PoolState } from "@/types";
import { formatDuration, formatTokenAmount, shortenAddress } from "@/utils/formatters";

export default function PoolDetailPage({ params }: { params: Promise<{ address: string }> }) {
  const { address } = use(params);
  const pool = address as Address;
  const { details, isLoading, error, refetch } = usePoolDetails(pool);
  const { data: paidIn, refetch: refetchPaid } = useContributionsInRound(pool, details?.currentRound);

  if (isLoading) return <p className="text-gray-500">Loading pool…</p>;
  if (error || !details) return <p className="text-red-600">Could not load this pool. Check the address and that your wallet is on the Anvil network.</p>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-mono text-xl font-bold text-gray-900">{shortenAddress(pool, 6)}</h1>
        <span className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${details.poolState === PoolState.Active ? "bg-stokvel-100 text-stokvel-700" : "bg-gray-200 text-gray-600"}`}>
          {details.poolState === PoolState.Active ? "Active" : "Dissolved"}
        </span>
      </div>

      <dl className="grid grid-cols-2 gap-4 rounded-xl bg-white p-6 shadow-sm sm:grid-cols-4">
        <div><dt className="text-xs text-gray-500">Per round</dt><dd className="font-semibold">{formatTokenAmount(details.contributionAmount)}</dd></div>
        <div><dt className="text-xs text-gray-500">Round length</dt><dd className="font-semibold">{formatDuration(details.durationPerRound)}</dd></div>
        <div><dt className="text-xs text-gray-500">Round</dt><dd className="font-semibold">{details.currentRound.toString()} / {details.totalMembers.toString()}</dd></div>
        <div><dt className="text-xs text-gray-500">Paid in this round</dt><dd className="font-semibold">{paidIn !== undefined ? formatTokenAmount(paidIn as bigint) : "—"}</dd></div>
      </dl>

      {details.poolState === PoolState.Active && (
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-3 font-semibold">Contribute</h2>
          <ContributeButton
            pool={pool}
            assetToken={details.assetToken}
            amount={details.contributionAmount}
            round={details.currentRound}
            onDone={() => { refetch(); refetchPaid(); }}
          />
        </div>
      )}

      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h2 className="mb-3 font-semibold">Members (payout order)</h2>
        <ol className="list-decimal space-y-1 pl-5 font-mono text-sm text-gray-700">
          {details.members.map((m) => <li key={m}>{m}</li>)}
        </ol>
      </div>
    </div>
  );
}