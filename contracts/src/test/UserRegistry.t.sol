// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/UserRegistry.sol";

contract UserRegistryTest is Test {
    UserRegistry public registry;

    address public user1 = address(0x1);
    address public user2 = address(0x2);

    event UserRegistered(address indexed userAddress, string identityHash);

    function setUp() public {
        registry = new UserRegistry();
    }

    function test_RegisterUserSuccess() public {
        vm.prank(user1);
        
        vm.expectEmit(true, false, false, true);
        emit UserRegistered(user1, "ipfs://user1-metadata");
        
        registry.registerUser("ipfs://user1-metadata");

        assertTrue(registry.isRegistered(user1));
        
        (string memory profileHash, uint256 registeredAt) = registry.getUserProfile(user1);
        assertEq(profileHash, "ipfs://user1-metadata");
        assertGt(registeredAt, 0);
    }

    function test_RevertWhen_RegisteringTwice() public {
        vm.startPrank(user1);
        registry.registerUser("ipfs://user1-metadata");

        vm.expectRevert("User already registered");
        registry.registerUser("ipfs://user1-metadata-new");
        vm.stopPrank();
    }

    function test_UnregisteredUserReturnsFalse() public view {
        assertFalse(registry.isRegistered(user2));
    }
}