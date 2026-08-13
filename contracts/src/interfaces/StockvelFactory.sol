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

/// @notice Deploys a new StokvelPool with the caller as creator.
    /// @dev Reverts with "Creator must be registered" (via StokvelPool's own constructor check)
    ///      if the caller has not registered in UserRegistry.
    /// @param assetToken The ERC-20 token used for contributions and payouts.
    /// @param contributionAmount The fixed amount each member must contribute per round.
    /// @param durationPerRound The nominal duration of each round, in seconds.
    /// @param members The fixed list of pool members, in payout order.
    /// @return pool The address of the newly deployed StokvelPool.
    function createPool(
        address assetToken,
        uint256 contributionAmount,
        uint256 durationPerRound,
        address[] calldata members
    ) external returns (address pool) {
        require(registry.isRegistered(msg.sender), "Creator must be registered");

        StokvelPool newPool = new StokvelPool(
            address(registry),
            assetToken,
            contributionAmount,
            durationPerRound,
            members
        );

        pool = address(newPool);
        allPools.push(pool);
        _poolsByCreator[msg.sender].push(pool);

        emit PoolCreated(pool, msg.sender, assetToken, contributionAmount, durationPerRound, members);
    }

    /// @notice Returns the total number of pools deployed through this factory.
    function totalPools() external view returns (uint256) {
        return allPools.length;
    }

    /// @notice Returns the full list of pools deployed through this factory.
    function getAllPools() external view returns (address[] memory) {
        return allPools;
    }

    /// @notice Returns the pools created by a given address.
    function getPoolsByCreator(address creator) external view returns (address[] memory) {
        return _poolsByCreator[creator];
    }
}
