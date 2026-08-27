# Smart Stokvel

A blockchain-based **stokvel** (rotating savings and credit association) platform. Members register on-chain, join a pool, and contribute a fixed amount each round; once every member has contributed, the round's pot is automatically paid out to that round's scheduled recipient, with a portion retained in reserve. The project pairs a Solidity smart contract backend (Foundry) with a Next.js/wagmi frontend.

> **Status: early scaffold.** The repository structure and test suites are in place, but most source files — including the core contracts — are still empty stubs. See [Project Status](#project-status) below before diving in.

## How it works

- **UserRegistry** — members register an identity (an IPFS metadata hash) before they can join any pool. Prevents duplicate registrations and exposes a simple on-chain profile lookup.
- **StokvelPool** — a single rotating savings pool created with a fixed member list, contribution amount, ERC-20 asset token, and round duration:
  - Only registered users (via `UserRegistry`) can create or join a pool.
  - Each member contributes once per round; a round closes automatically once every member has contributed.
  - On round completion, 90% of the round's total pot is paid out to that round's scheduled recipient, and 10% is retained in the pool as a reserve.
  - The pool cycles through members as payout recipients and **dissolves** once every member has received a payout.

## Tech Stack

**Contracts**
- Solidity `^0.8.20`
- [Foundry](https://book.getfoundry.sh/) (Forge/Anvil) for building, testing, and deployment scripting
- OpenZeppelin Contracts (ERC-20 mock for testing)

**Frontend**
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- wagmi (wallet/contract hooks)

## Project Structure

```
smart_stokvel/
├── contracts/
│   ├── foundry.toml                       # Foundry configuration
│   ├── remappings.txt                     # Library import paths
│   ├── script/
│   │   ├── DeployRegistry.s.sol           # Deployment script for UserRegistry
│   │   └── DeployStockvel.s.sol           # Deployment script for StokvelPool
│   └── src/
│       ├── UserRegistry.sol               # User registration & identity
│       ├── StokvelPool.sol                # Core rotating-savings pool logic
│       ├── interfaces/
│       │   ├── IUserRegistry.sol
│       │   ├── IStockvelPool.sol
│       │   └── StockvelFactory.sol        # Factory for deploying new pools
│       └── test/
│           ├── UserRegistry.t.sol         # Foundry tests for UserRegistry
│           ├── StockvelPool.t.sol         # Foundry tests for StokvelPool
│           └── mocks/
│               └── MockERC20.sol          # Mock ERC-20 token used in tests
│
└── frontend/
    ├── next.config.ts
    ├── tailwind.config.ts
    ├── tsconfig.json
    ├── .env.example
    └── src/
        ├── app/
        │   ├── layout.tsx                 # Root layout, wrapped with Web3 providers
        │   └── page.tsx                   # Landing / dashboard page
        ├── pools/                         # Pool list, create-pool, and pool-detail routes
        ├── components/                    # UI components
        ├── config/                        # wagmi configuration
        ├── contracts/
        │   ├── abis/                      # Contract ABIs (UserRegistry, StokvelPool)
        │   └── addresses.ts                # Deployed contract addresses
        ├── hooks/
        │   ├── useUserRegistry.ts         # Hook wrapping UserRegistry contract calls
        │   └── useStokvelPool.ts          # Hook wrapping StokvelPool contract calls
        ├── types/                         # Shared TypeScript types
        └── utils/
            └── formatters.ts              # Display/formatting helpers
```

## Project Status

This repo is a work-in-progress scaffold. As of now:

| Area | Status |
|---|---|
| `UserRegistry.sol` | ⬜ Not yet implemented (empty file) |
| `StokvelPool.sol` | ⬜ Not yet implemented (empty file) |
| Interfaces (`IUserRegistry`, `IStockvelPool`, `StockvelFactory`) | ⬜ Not yet implemented |
| Deployment scripts | ⬜ Not yet implemented |
| `UserRegistry.t.sol` | ✅ Test suite written |
| `StockvelPool.t.sol` | ✅ Test suite written |
| `MockERC20.sol` | ✅ Implemented |
| Frontend pages, hooks, config | ⬜ Scaffolded (files exist, not yet implemented) |

The test files describe the intended contract behavior in detail and are the best current reference for what each contract needs to implement.

## Getting Started

### Prerequisites

- [Foundry](https://book.getfoundry.sh/getting-started/installation) (`forge`, `cast`, `anvil`)
- [Node.js](https://nodejs.org/) (for the frontend)

### Contracts

```bash
cd contracts

# install dependencies (per remappings.txt)
forge install

# build
forge build

# run the test suite
forge test -vv
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Copy `.env.example` to `.env.local` and fill in the required values (RPC URL, deployed contract addresses, etc.) before running the frontend against a live or local chain.

## Testing

Contract tests live under `contracts/src/test/` and are run with Forge:

```bash
forge test -vv
```

`UserRegistry.t.sol` and `StockvelPool.t.sol` cover registration, pool creation, contribution/payout flow, and expected revert conditions, and should be kept green as the underlying contracts are implemented.

## Roadmap

- [ ] Implement `UserRegistry.sol`
- [ ] Implement `StokvelPool.sol`
- [ ] Implement `StockvelFactory.sol` for deploying new pools
- [ ] Wire up deployment scripts (`DeployRegistry.s.sol`, `DeployStockvel.s.sol`)
- [ ] Connect frontend hooks (`useUserRegistry`, `useStokvelPool`) to deployed contracts
- [ ] Build out pool list / create / detail pages under `frontend/src/pools`

## License

MIT

## Roadmap

- [ ] Implement `UserRegistry.sol`
- [ ] Implement `StokvelPool.sol`
- [ ] Implement `StockvelFactory.sol` for deploying new pools
- [ ] Wire up deployment scripts (`DeployRegistry.s.sol`, `DeployStockvel.s.sol`)
- [ ] Connect frontend hooks (`useUserRegistry`, `useStokvelPool`) to deployed contracts
- [ ] Build out pool list / create / detail pages under `frontend/src/pools`

## License

MIT

