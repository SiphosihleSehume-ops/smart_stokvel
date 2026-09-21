"use client";

import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useIsRegistered, useRegisterUser } from "@/hooks/useUserRegistry";

export default function RegisterPage() {
  const { address, isConnected } = useAccount();
  const { data: isRegistered, refetch, isLoading } = useIsRegistered();
  const { registerUser, isPending, isConfirming, isConfirmed, error } = useRegisterUser();
  const [name, setName] = useState("");

  useEffect(() => {
    if (isConfirmed) refetch();
  }, [isConfirmed, refetch]);

  if (!isConnected || !address) {
    return <p className="text-gray-600">Connect your wallet to register.</p>;
  }
  if (isLoading) return <p className="text-gray-500">Checking registration…</p>;
  if (isRegistered) {
    return <p className="rounded-lg bg-stokvel-50 p-4 text-stokvel-700">You are registered ✅</p>;
  }

  return (
    <div className="max-w-md">
      <h1 className="text-2xl font-bold text-gray-900">Register</h1>
      <p className="mt-1 text-sm text-gray-500">
        Registering links your wallet to a profile so you can create or join pools.
      </p>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name or profile hash"
        className="mt-4 w-full rounded-lg border border-gray-300 px-3 py-2"
      />
      <button
        disabled={!name.trim() || isPending || isConfirming}
        onClick={() => registerUser(name.trim())}
        className="mt-3 rounded-lg bg-stokvel-600 px-4 py-2 font-medium text-white hover:bg-stokvel-700 disabled:opacity-50"
      >
        {isPending ? "Confirm in wallet…" : isConfirming ? "Registering…" : "Register"}
      </button>
      {error && <p className="mt-3 text-sm text-red-600">{error.message.split("\n")[0]}</p>}
    </div>
  );
}