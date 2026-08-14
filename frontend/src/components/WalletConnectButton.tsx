"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { shortenAddress } from "@/utils/formatters";

export function WalletConnectButton() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected && address) {
    return (
      <button
        onClick={() => disconnect()}
        className="rounded-lg bg-stokvel-600 px-4 py-2 text-sm font-medium text-white hover:bg-stokvel-700"
      >
        {shortenAddress(address)}
      </button>
    );
  }

  return (
    <button
      onClick={() => connect({ connector: connectors[0] })}
      disabled={isPending}
      className="rounded-lg bg-stokvel-600 px-4 py-2 text-sm font-medium text-white hover:bg-stokvel-700 disabled:opacity-50"
    >
      {isPending ? "Connecting..." : "Connect Wallet"}
    </button>
  );
}
