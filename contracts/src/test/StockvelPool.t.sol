// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../UserRegistry.sol";
import "../StokvelPool.sol";
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

    function test_InitialPoolState() public view {
        assertEq(address(pool.registry()), address(registry));
        assertEq(address(pool.assetToken()), address(token));
        assertEq(pool.contributionAmount(), CONTRIBUTION_AMOUNT);
        assertEq(uint256(pool.poolState()), uint256(StokvelPool.PoolState.Active));
        assertEq(pool.totalMembers(), 3);
        assertEq(pool.currentRound(), 1);
    }

    function test_RevertWhen_UnregisteredUserCreatesPool() public {
        address[] memory poolMembers = new address[](1);
        poolMembers[0] = nonMember;

        vm.expectRevert("Creator must be registered");
        vm.prank(nonMember);
        new StokvelPool(
            address(registry),
            address(token),
            CONTRIBUTION_AMOUNT,
            DURATION_PER_ROUND,
            poolMembers
        );
    }

    function test_DepositAndDistribution90PercentPayout() public {
        // Total Pool Deposit for 3 members = 300 MTK
        // Expected Payout (90%) = 270 MTK
        // Expected Reserve (10%) = 30 MTK
        uint256 expectedTotalPool = CONTRIBUTION_AMOUNT * 3;
        uint256 expectedPayout = (expectedTotalPool * 90) / 100;
        uint256 expectedReserve = (expectedTotalPool * 10) / 100;

        uint256 initialRecipientBalance = token.balanceOf(creator);

        // All 3 members deposit for Round 1
        vm.prank(creator);
        pool.contribute();

        vm.prank(member1);
        pool.contribute();

        // Third contribution completes the round and triggers automatic 90% payout
        vm.prank(member2);
        pool.contribute();

        // Verify creator (scheduled payout recipient for round 1) received 90%
        uint256 finalRecipientBalance = token.balanceOf(creator);
        assertEq(finalRecipientBalance - initialRecipientBalance + CONTRIBUTION_AMOUNT, expectedPayout);

        // Verify contract retains 10% reserve balance
        assertEq(token.balanceOf(address(pool)), expectedReserve);

        // Verify pool advanced to Round 2
        assertEq(pool.currentRound(), 2);
    }

    function test_FullLifecycleToDissolution() public {
        address[3] memory payoutOrder = [creator, member1, member2];

        // Execute all 3 rounds
        for (uint256 round = 0; round < 3; round++) {
            vm.prank(creator);
            pool.contribute();

            vm.prank(member1);
            pool.contribute();

            vm.prank(member2);
            pool.contribute();
        }

        // Verify pool is dissolved after round 3 completion
        assertEq(uint256(pool.poolState()), uint256(StokvelPool.PoolState.Dissolved));

        // Verify no further contributions allowed
        vm.expectRevert("Pool dissolved");
        vm.prank(creator);
        pool.contribute();
    }

    function test_RevertWhen_DoubleContributionInSameRound() public {
        vm.prank(creator);
        pool.contribute();

        vm.expectRevert("Already contributed for this round");
        vm.prank(creator);
        pool.contribute();
    }

    function test_RevertWhen_NonMemberTriesToContribute() public {
        vm.expectRevert("Not a pool member");
        vm.prank(nonMember);
        pool.contribute();
    }

}
 