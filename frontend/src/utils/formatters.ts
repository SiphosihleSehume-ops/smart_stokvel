import { formatUnits, parseUnits } from "viem";

/** Formats a raw ERC-20 token amount (bigint, base units) into a human-readable string. */
export function formatTokenAmount(amount: bigint, decimals = 18, maxFractionDigits = 4): string {
  const formatted = formatUnits(amount, decimals);
  const [whole, fraction] = formatted.split(".");
  if (!fraction) return whole;
  return `${whole}.${fraction.slice(0, maxFractionDigits)}`;
}

/** Parses a human-entered token amount string into raw ERC-20 base units. */
export function parseTokenAmount(amount: string, decimals = 18): bigint {
  if (!amount || Number.isNaN(Number(amount))) return 0n;
  return parseUnits(amount as `${number}`, decimals);
}

/** Shortens a 0x address to `0x1234...abcd` form. */
export function shortenAddress(address: string, chars = 4): string {
  if (!address) return "";
  return `${address.slice(0, 2 + chars)}...${address.slice(-chars)}`;
}

/** Formats a unix timestamp (seconds, as returned by Solidity `block.timestamp`) as a date string. */
export function formatTimestamp(timestamp: bigint | number): string {
  const ms = Number(timestamp) * 1000;
  if (!ms) return "—";
  return new Date(ms).toLocaleString();
}

/** Formats a duration given in seconds (e.g. a round's duration) as a short human string. */
export function formatDuration(seconds: bigint | number): string {
  const s = Number(seconds);
  const days = Math.floor(s / 86400);
  if (days > 0) return `${days} day${days === 1 ? "" : "s"}`;
  const hours = Math.floor(s / 3600);
  if (hours > 0) return `${hours} hour${hours === 1 ? "" : "s"}`;
  const minutes = Math.floor(s / 60);
  return `${minutes} minute${minutes === 1 ? "" : "s"}`;
}
