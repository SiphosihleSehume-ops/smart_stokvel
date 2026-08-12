// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../StokvelPool.sol";
import "./IUserRegistry.sol";

/// @title StockvelFactory
/// @notice Deploys new StokvelPool instances and keeps a registry of all pools created
///         through the factory. Pool creation is gated to users registered in UserRegistry
///         (StokvelPool itself also enforces this at construction time).
contract StockvelFactory {
    IUserRegistry public immutable registry;

    address[] public allPools;
    mapping(address => address[]) private _poolsByCreator;

    event PoolCreated(
        address indexed pool,
        address indexed creator,
        address indexed assetToken,
        uint256 contributionAmount,
        uint256 durationPerRound,
        address[] members
    );

    constructor(address _registry) {
        require(_registry != address(0), "Registry required");
        registry = IUserRegistry(_registry);

        // StokvelPool's constructor checks that its *deployer* (msg.sender at construction
        // time) is registered. Since pools created through this factory are deployed by the
        // factory itself (not the end user directly), the factory registers itself once here
        // so that check passes for every pool it creates. The real per-caller check lives in
        // createPool() below, which enforces that the *actual end user* is registered before
        // the factory is ever allowed to deploy a pool on their behalf.
        if (!registry.isRegistered(address(this))) {
            registry.registerUser("ipfs://stockvel-factory");
        }
    }
