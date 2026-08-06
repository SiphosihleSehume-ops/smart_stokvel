// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract UserRegistry {
    struct UserProfile {
        string identityHash;
        uint256 registeredAt;
        bool exists;
    }

    mapping(address => UserProfile) private _users;

    event UserRegistered(address indexed userAddress, string identityHash);

    /**
     * @notice Registers a new user with an identity metadata hash (e.g., IPFS URI).
     * @param identityHash The URI or hash pointing to user metadata.
     */
    function registerUser(string calldata identityHash) external {
        require(!_users[msg.sender].exists, "User already registered");

        _users[msg.sender] = UserProfile({
            identityHash: identityHash,
            registeredAt: block.timestamp,
            exists: true
        });

        emit UserRegistered(msg.sender, identityHash);
    }

    /**
     * @notice Checks if an address is registered.
     * @param userAddress The target address to verify.
     */
    function isRegistered(address userAddress) external view returns (bool) {
        return _users[userAddress].exists;
    }

    /**
     * @notice Retrieves the profile metadata and registration timestamp.
     * @param userAddress The target user's address.
     */
    function getUserProfile(address userAddress) external view returns (string memory profileHash, uint256 registeredAt) {
        require(_users[userAddress].exists, "User not registered");
        UserProfile storage profile = _users[userAddress];
        return (profile.identityHash, profile.registeredAt);
    }
}