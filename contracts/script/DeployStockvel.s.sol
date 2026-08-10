// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/UserRegistry.sol";
import "../src/interfaces/StockvelFactory.sol";

/// @notice Deploys the StockvelFactory contract, wired to an already-deployed UserRegistry.
/// @dev Usage:
///   forge script script/DeployStockvel.s.sol:DeployStockvel \
///     --rpc-url <RPC_URL> --private-key <PRIVATE_KEY> --broadcast \
///     --sig "run(address)" <USER_REGISTRY_ADDRESS>
///
///   Or set REGISTRY_ADDRESS in the environment and call run() with no args.
contract DeployStockvel is Script {
    function run() external returns (StockvelFactory factory) {
        address registryAddress = vm.envAddress("REGISTRY_ADDRESS");
        factory = run(registryAddress);
    }

    function run(address registryAddress) public returns (StockvelFactory factory) {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        vm.startBroadcast(deployerPrivateKey);
        factory = new StockvelFactory(registryAddress);
        vm.stopBroadcast();

        console.log("StockvelFactory deployed at:", address(factory));
        console.log("Using UserRegistry at:", registryAddress);
    }
}
