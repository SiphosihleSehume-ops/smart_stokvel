// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./UserRegistry.sol";
import "./interfaces/IStockvelPool.sol";

contract StokvelPool is IStockvelPool {
    enum PoolState { Active, Dissolved }

    IUserRegistry public immutable registry; // Used to check members are registered users
    IERC20 public immutable assetToken;     // The ERC20 token used for contributions/payouts
    uint256 public immutable contributionAmount;
    uint256 public immutable durationPerRound;

    PoolState public poolState;
    uint256 public currentRound;
    uint256 public totalMembers;

    address[] private _members;
    mapping(address => bool) private _isMember;

    // roundNumber => memberAddress => hasContributed
    mapping(uint256 => mapping(address => bool)) private _hasContributed;

    // roundNumber => count of contributions received so far
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

        poolState = PoolState.Active;
        currentRound = 1;

        for (uint256 i = 0; i < poolMembers.length; i++) {
            address member = poolMembers[i];

            require(registry.isRegistered(member), "All members must be registered");
            require(!_isMember[member], "Member already added");

            _members.push(member);
            _isMember[member] = true;
        }

        totalMembers = _members.length;
        require(totalMembers > 0, "Pool must have members");
    }

    // Corrected Version

    function contribute() external {
    require(poolState == PoolState.Active, "Pool dissolved");
    require(_isMember[msg.sender], "Not a pool member");
    require(!_hasContributed[currentRound][msg.sender], "Already contributed for this round");

    // Effects: update state BEFORE the external call 
    _hasContributed[currentRound][msg.sender] = true;
    _roundContributions[currentRound]++;

    // Interaction: external call happens last 
    bool success = assetToken.transferFrom(msg.sender, address(this), contributionAmount);
    require(success, "Token transfer failed");

    emit ContributionMade(msg.sender, currentRound, contributionAmount);

    if (_roundContributions[currentRound] == totalMembers) {
        _completeRound();
    }
}

    // Corrected Version
    function _completeRound() internal {
    // Calculate the total amount contributed
    uint256 totalPool = contributionAmount * totalMembers;

    // 90% goes to the scheduled recipient
    uint256 payout = (totalPool * 90) / 100;

    // The remaining 10% stays inside the contract as reserve
    uint256 reserve = totalPool - payout;

    // Determine who receives this round's payout
    address recipient = _members[(currentRound - 1) % totalMembers];

    // Effects: update state BEFORE the external call 
    uint256 paidRound = currentRound;
    if (currentRound == totalMembers) {
        poolState = PoolState.Dissolved;
    } else {
        currentRound++;
    }

    // Interaction: external call happens last
    bool success = assetToken.transfer(recipient, payout);
    require(success, "Payout transfer failed");

    emit RoundPaidOut(paidRound, recipient, payout, reserve);

    // `reserve` intentionally remains inside the pool.
}

}