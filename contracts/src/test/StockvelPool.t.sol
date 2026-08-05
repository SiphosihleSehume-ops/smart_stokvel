// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/UserRegistry.sol";
import "../src/StokvelPool.sol";
import "./mocks/MockERC20.sol";

contract StokvelPoolTest is Test {
    UserRegistry public registry;
    StokvelPool public pool;
    MockERC20 public token;

    address public creator = address(0x10);
    address public member1 = address(0x11);
    address public member2 = address(0x12);
    address public nonMember = address(0x99);

    uint256 public constant CONTRIBUTION_AMOUNT = 100 * 10**18; // 100 MTK
    uint256 public constant DURATION_PER_ROUND = 7 days;

    function setUp() public {
        // 1. Deploy contracts
        registry = new UserRegistry();
        token = new MockERC20();

        // 2. Register participants in UserRegistry
        vm.prank(creator);
        registry.registerUser("ipfs://creator");

        vm.prank(member1);
        registry.registerUser("ipfs://member1");

        vm.prank(member2);
        registry.registerUser("ipfs://member2");

        // 3. Fund members with tokens and approve pool contract spending
        address[3] memory members = [creator, member1, member2];
        
        for (uint256 i = 0; i < members.length; i++) {
            token.mint(members[i], 1_000 * 10**18);
        }

        // 4. Initialize Pool with registered members
        address[] memory poolMembers = new address[](3);
        poolMembers[0] = creator;
        poolMembers[1] = member1;
        poolMembers[2] = member2;

        vm.prank(creator);
        pool = new StokvelPool(
            address(registry),
            address(token),
            CONTRIBUTION_AMOUNT,
            DURATION_PER_ROUND,
            poolMembers
        );

        // Approve tokens for all members
        for (uint256 i = 0; i < members.length; i++) {
            vm.prank(members[i]);
            token.approve(address(pool), type(uint256).max);
        }
    }
}
 