// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title Counter
 * @dev A simple counter contract that can be incremented/decremented
 */
contract Counter {
    uint256 public count;
    address public owner;
    
    event CountChanged(uint256 newCount, address indexed changedBy, string action);
    
    constructor() {
        owner = msg.sender;
        count = 0;
    }
    
    function increment() public {
        count++;
        emit CountChanged(count, msg.sender, "increment");
    }
    
    function decrement() public {
        require(count > 0, "Count cannot be negative");
        count--;
        emit CountChanged(count, msg.sender, "decrement");
    }
    
    function reset() public {
        require(msg.sender == owner, "Only owner can reset");
        count = 0;
        emit CountChanged(0, msg.sender, "reset");
    }
    
    function add(uint256 _value) public {
        count += _value;
        emit CountChanged(count, msg.sender, "add");
    }
    
    function subtract(uint256 _value) public {
        require(count >= _value, "Cannot subtract more than count");
        count -= _value;
        emit CountChanged(count, msg.sender, "subtract");
    }
}

