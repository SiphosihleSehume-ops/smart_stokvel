// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./UserRegistry.sol";

contract StokvelPool {
    enum PoolState { Active, Dissolved }

    UserRegistry public immutable registry;
    IERC20 public immutable assetToken;
    uint256 public immutable contributionAmount;
    uint256 public immutable durationPerRound;

    PoolState public poolState;
    uint256 public currentRound;
    uint256 public totalMembers;

    address[] private _members;
    mapping(address => bool) private _isMember;
    
    // Mapping: roundNumber => memberAddress => hasContributed
    mapping(uint256 => mapping(address => bool)) private _hasContributed;
    
    // Mapping: roundNumber => count of contributions
    mapping(uint256 => uint256) private _roundContributions;

    constructor(
        address registryAddress,
        address tokenAddress,
        uint256 _contributionAmount,
        uint256 _durationPerRound,
        address[] memory poolMembers
    ) {
        registry = UserRegistry(registryAddress);
        
        require(registry.isRegistered(msg.sender), "Creator must be registered");

        assetToken = IERC20(tokenAddress);
        contributionAmount = _contributionAmount;
        durationPerRound = _durationPerRound;

    }

}