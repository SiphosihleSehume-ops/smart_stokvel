// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title IUserRegistry
/// @notice Interface for the on-chain user identity registry used by Smart Stokvel.
interface IUserRegistry {
    /// @notice Emitted when a new user successfully registers.
    /// @param userAddress The address that registered.
    /// @param identityHash A content hash (e.g. an IPFS URI) pointing to the user's off-chain profile data.
    event UserRegistered(address indexed userAddress, string identityHash);

    /// @notice Registers the caller with an identity/profile hash.
    /// @dev Reverts with "User already registered" if the caller has already registered.
    /// @param identityHash A content hash (e.g. an IPFS URI) pointing to the user's off-chain profile data.
    function registerUser(string calldata identityHash) external;

    /// @notice Returns whether a given address has registered.
    /// @param userAddress The address to check.
    function isRegistered(address userAddress) external view returns (bool);

    /// @notice Returns the stored profile hash and registration timestamp for a user.
    /// @param userAddress The address to look up.
    /// @return profileHash The content hash supplied at registration.
    /// @return registeredAt The block timestamp at which the user registered.
    function getUserProfile(address userAddress)
        external
        view
        returns (string memory profileHash, uint256 registeredAt);
}
