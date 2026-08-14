import Link from "next/link";
import { WalletConnectButton } from "./WalletConnectButton";

export function Navbar() {
  return (
    <nav className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
      <Link href="/" className="text-lg font-semibold text-stokvel-700">
        Smart Stokvel
      </Link>
      <div className="flex items-center gap-6 text-sm font-medium text-gray-600">
        <Link href="/pools" className="hover:text-stokvel-700">
          Pools
        </Link>
        <Link href="/pools/create" className="hover:text-stokvel-700">
          Create Pool
        </Link>
        <Link href="/register" className="hover:text-stokvel-700">
          Register
        </Link>
        <WalletConnectButton />
      </div>
    </nav>
  );
}
