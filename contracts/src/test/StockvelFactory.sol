// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../UserRegistry.sol";
import "../interfaces/StockvelFactory.sol";
import "../StokvelPool.sol";
import "./mocks/MockERC20.sol";

contract StockvelFactoryTest is Test {
    UserRegistry public registry;
    StockvelFactory public factory;
    MockERC20 public token;

    address public creator = address(0x10);
    address public member1 = address(0x11);
    address public member2 = address(0x12);
    address public nonMember = address(0x99);

    uint256 public constant CONTRIBUTION_AMOUNT = 100 * 10 ** 18;
    uint256 public constant DURATION_PER_ROUND = 7 days;

    function setUp() public {
        registry = new UserRegistry();
        factory = new StockvelFactory(address(registry));
        token = new MockERC20();

        vm.prank(creator);
        registry.registerUser("ipfs://creator");
        vm.prank(member1);
        registry.registerUser("ipfs://member1");
        vm.prank(member2);
        registry.registerUser("ipfs://member2");
    }

    function _members() internal view returns (address[] memory poolMembers) {
        poolMembers = new address[](3);
        poolMembers[0] = creator;
        poolMembers[1] = member1;
        poolMembers[2] = member2;
    }

    function test_FactoryRegistersItself() public view {
        assertTrue(registry.isRegistered(address(factory)));
    }

    function test_CreatePoolSuccess() public {
        vm.prank(creator);
        address pool = factory.createPool(address(token), CONTRIBUTION_AMOUNT, DURATION_PER_ROUND, _members());

        assertEq(factory.totalPools(), 1);
        assertEq(factory.getAllPools()[0], pool);
        assertEq(factory.getPoolsByCreator(creator)[0], pool);
        assertEq(address(StokvelPool(pool).registry()), address(registry));
        assertEq(uint256(StokvelPool(pool).poolState()), uint256(StokvelPool.PoolState.Active));
    }

    function test_RevertWhen_UnregisteredCreatorUsesFactory() public {
        vm.expectRevert("Creator must be registered");
        vm.prank(nonMember);
        factory.createPool(address(token), CONTRIBUTION_AMOUNT, DURATION_PER_ROUND, _members());
    }
}
