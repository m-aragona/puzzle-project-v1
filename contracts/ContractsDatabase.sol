//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract ContractsDatabase is Ownable {
    string[] public contracts;

    function setContractsPush(string[] calldata arrContracts)
        external
        onlyOwner
    {
        for (uint256 i = 0; i < arrContracts.length; i++) {
            contracts.push(arrContracts[i]);
        }
    }

    function setContractsPop() public onlyOwner {
        contracts.pop();
    }

    function currentContract() public view returns (string memory) {
        return contracts[contracts.length - 1];
    }

    function popAll() public onlyOwner {
        for (uint256 i = 0; i < contracts.length; i++) {
            contracts.pop();
        }
    }
}
