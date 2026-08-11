// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./IUserRegistry.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/// @title IStokvelPool
/// @notice Interface for a single rotating-savings (stokvel) pool.
interface IStokvelPool {
    /// @notice Emitted whenever a member successfully contributes for the current round.
    event ContributionMade(address indexed member, uint256 indexed round, uint256 amount);

    /// @notice Emitted when a round completes and the round's payout is sent to its recipient.
    event RoundPaidOut(uint256 indexed round, address indexed recipient, uint256 payoutAmount, uint256 reserveAmount);

    /// @notice Emitted once every member has received a payout and the pool dissolves.
    event PoolDissolved();

    /// @notice Contribute the fixed `contributionAmount` for the current round.
    /// @dev Reverts with "Pool dissolved" if the pool has already dissolved,
    ///      "Not a pool member" if the caller is not one of the pool's members,
    ///      or "Already contributed for this round" if the caller has already paid in this round.
    function contribute() external;

    /// @notice The user registry used to gate pool creation to registered users.
    function registry() external view returns (IUserRegistry);

    /// @notice The ERC-20 token used for contributions and payouts.
    function assetToken() external view returns (address);

    /// @notice The fixed amount each member must contribute per round.
    function contributionAmount() external view returns (uint256);

    /// @notice The total number of members in the pool (and number of rounds in a full cycle).
    function totalMembers() external view returns (uint256);

    /// @notice The round currently accepting contributions (1-indexed).
    function currentRound() external view returns (uint256);
}
