"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { isAddress, type Address } from "viem";
import { useCreatePool } from "@/hooks/useStockvelPools";
import { useIsRegistered } from "@/hooks/useUserRegistry";
import { parseTokenAmount } from "@/utils/formatters";

const DEFAULT_TOKEN = (process.env.NEXT_PUBLIC_TOKEN_ADDRESS ?? "") as string;

export default function CreatePoolPage() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { data: isRegistered } = useIsRegistered();
  const { createPool, isPending, isConfirming, isConfirmed, error } = useCreatePool();

  const [token, setToken] = useState(DEFAULT_TOKEN);
  const [amount, setAmount] = useState("100");
  const [durationDays, setDurationDays] = useState("7");
  const [membersText, setMembersText] = useState(address ?? "");

  const members = membersText.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean);
  const membersValid = members.length >= 2 && members.every((m) => isAddress(m));
  const unique = new Set(members.map((m) => m.toLowerCase())).size === members.length;
  const valid = isAddress(token) && Number(amount) > 0 && Number(durationDays) > 0 && membersValid && unique;

  if (!isConnected) return <p className="text-gray-600">Connect your wallet to create a pool.</p>;
  if (isRegistered === false) {
    return <p className="text-gray-600">You need to <a className="underline" href="/register">register</a> before creating a pool.</p>;
  }
  if (isConfirmed) {
    return (
      <div>
        <p className="rounded-lg bg-stokvel-50 p-4 text-stokvel-700">Pool created ✅</p>
        <button className="mt-4 underline" onClick={() => router.push("/pools")}>View pools</button>
      </div>
    );
  }

  return (
    <div className="max-w-xl space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Create Pool</h1>
      <label className="block text-sm">Token address
        <input value={token} onChange={(e) => setToken(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 font-mono text-xs" />
      </label>
      <label className="block text-sm">Contribution per round (tokens)
        <input value={amount} onChange={(e) => setAmount(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2" />
      </label>
      <label className="block text-sm">Round length (days)
        <input value={durationDays} onChange={(e) => setDurationDays(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2" />
      </label>
      <label className="block text-sm">Members in payout order (one address per line)
        <textarea rows={5} value={membersText} onChange={(e) => setMembersText(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 font-mono text-xs" />
      </label>
      {!unique && <p className="text-sm text-red-600">Duplicate member addresses.</p>}
      <p className="text-xs text-gray-500">Every member must already be registered, or the transaction will revert.</p>
      <button
        disabled={!valid || isPending || isConfirming}
        onClick={() => createPool(token as Address, parseTokenAmount(amount), BigInt(Math.round(Number(durationDays) * 86400)), members as Address[])}
        className="rounded-lg bg-stokvel-600 px-4 py-2 font-medium text-white hover:bg-stokvel-700 disabled:opacity-50"
      >
        {isPending ? "Confirm in wallet…" : isConfirming ? "Creating…" : "Create pool"}
      </button>
      {error && <p className="text-sm text-red-600">{error.message.split("\n")[0]}</p>}
    </div>
  );
}