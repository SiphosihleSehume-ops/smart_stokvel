// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/UserRegistry.sol";

/// @notice Deploys the UserRegistry contract.
/// @dev Usage:
///   forge script script/DeployRegistry.s.sol:DeployRegistry \
///     --rpc-url <RPC_URL> --private-key <PRIVATE_KEY> --broadcast
contract DeployRegistry is Script {
    function run() external returns (UserRegistry registry) {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        vm.startBroadcast(deployerPrivateKey);
        registry = new UserRegistry();
        vm.stopBroadcast();

        console.log("UserRegistry deployed at:", address(registry));
    }
}
