import Link from "next/link";

export default function HomePage() {
  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold text-gray-900">Smart Stokvel</h1>
      <p className="mt-2 text-gray-600">
        A blockchain-based rotating savings pool. Register, join a pool, and
        contribute each round.
      </p>
      <Link
        href="/pools"
        className="mt-6 inline-block rounded-lg bg-stokvel-600 px-5 py-2.5 font-medium text-white hover:bg-stokvel-700"
      >
        View Pools
      </Link>
    </div>
  );
}
