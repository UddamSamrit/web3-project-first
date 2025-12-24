// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SimpleStorage {
    uint256 private storedValue;
    address public owner;
    
    event ValueChanged(uint256 newValue, address indexed changedBy);
    
    constructor() {
        owner = msg.sender;
        storedValue = 0;
    }
    
    function setValue(uint256 _value) public {
        storedValue = _value;
        emit ValueChanged(_value, msg.sender);
    }
    
    function getValue() public view returns (uint256) {
        return storedValue;
    }
    
    function getOwner() public view returns (address) {
        return owner;
    }
}

