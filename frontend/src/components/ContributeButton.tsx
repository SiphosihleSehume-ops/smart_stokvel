"use client";

import { useEffect } from "react";
import type { Address } from "viem";
import { useAccount } from "wagmi";
import { useTokenAllowance, useTokenBalance, useApproveToken } from "@/hooks/useToken";
import { useContribute, useHasContributed, useIsPoolMember } from "@/hooks/useStockvelPool";
import { formatTokenAmount } from "@/utils/formatters";

type Props = {
  pool: Address;
  assetToken: Address;
  amount: bigint;
  round: bigint;
  onDone?: () => void;
};

/** Two-step flow: approve the pool for `amount`, then call contribute(). */
export function ContributeButton({ pool, assetToken, amount, round, onDone }: Props) {
  const { isConnected } = useAccount();
  const { data: isMember } = useIsPoolMember(pool);
  const { data: contributed, refetch: refetchContributed } = useHasContributed(pool, round);
  const { data: allowance, refetch: refetchAllowance } = useTokenAllowance(assetToken, pool);
  const { data: balance } = useTokenBalance(assetToken);

  const approve = useApproveToken(assetToken);
  const contribute = useContribute(pool);

  useEffect(() => { if (approve.isConfirmed) refetchAllowance(); }, [approve.isConfirmed, refetchAllowance]);
  useEffect(() => {
    if (contribute.isConfirmed) { refetchContributed(); refetchAllowance(); onDone?.(); }
  }, [contribute.isConfirmed, refetchContributed, refetchAllowance, onDone]);

  if (!isConnected) return <p className="text-sm text-gray-500">Connect your wallet to contribute.</p>;
  if (isMember === false) return <p className="text-sm text-gray-500">Only pool members can contribute.</p>;
  if (contributed) return <p className="text-sm text-stokvel-700">You have contributed this round ✅</p>;

  const enough = (balance as bigint | undefined) !== undefined && (balance as bigint) >= amount;
  const needsApproval = ((allowance as bigint | undefined) ?? 0n) < amount;
  const busy = approve.isPending || approve.isConfirming || contribute.isPending || contribute.isConfirming;
  const err = approve.error ?? contribute.error;

  return (
    <div>
      {!enough && <p className="mb-2 text-sm text-red-600">Insufficient token balance (need {formatTokenAmount(amount)}).</p>}
      {needsApproval ? (
        <button disabled={busy || !enough} onClick={() => approve.approve(pool, amount)}
          className="rounded-lg bg-stokvel-600 px-4 py-2 font-medium text-white hover:bg-stokvel-700 disabled:opacity-50">
          {approve.isPending ? "Confirm in wallet…" : approve.isConfirming ? "Approving…" : `Step 1: Approve ${formatTokenAmount(amount)}`}
        </button>
      ) : (
        <button disabled={busy || !enough} onClick={() => contribute.contribute()}
          className="rounded-lg bg-stokvel-600 px-4 py-2 font-medium text-white hover:bg-stokvel-700 disabled:opacity-50">
          {contribute.isPending ? "Confirm in wallet…" : contribute.isConfirming ? "Contributing…" : "Step 2: Contribute"}
        </button>
      )}
      {err && <p className="mt-2 text-sm text-red-600">{err.message.split("\n")[0]}</p>}
    </div>
  );
}