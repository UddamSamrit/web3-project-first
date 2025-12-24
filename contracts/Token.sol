// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title SimpleToken
 * @dev A very simple ERC20-like token for learning
 */
contract Token {
    string public name = "My Test Token";
    string public symbol = "MTT";
    uint8 public decimals = 18;
    uint256 public totalSupply;
    
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;
    
    address public owner;
    
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event Mint(address indexed to, uint256 value);
    
    constructor() {
        owner = msg.sender;
        totalSupply = 1000000 * 10**decimals; // 1 million tokens
        balanceOf[msg.sender] = totalSupply;
        emit Transfer(address(0), msg.sender, totalSupply);
    }
    
    function transfer(address _to, uint256 _value) public returns (bool) {
        require(balanceOf[msg.sender] >= _value, "Insufficient balance");
        require(_to != address(0), "Invalid address");
        
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        
        emit Transfer(msg.sender, _to, _value);
        return true;
    }
    
    function approve(address _spender, uint256 _value) public returns (bool) {
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }
    
    function transferFrom(address _from, address _to, uint256 _value) public returns (bool) {
        require(balanceOf[_from] >= _value, "Insufficient balance");
        require(allowance[_from][msg.sender] >= _value, "Insufficient allowance");
        require(_to != address(0), "Invalid address");
        
        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;
        allowance[_from][msg.sender] -= _value;
        
        emit Transfer(_from, _to, _value);
        return true;
    }
    
    function mint(address _to, uint256 _value) public {
        require(msg.sender == owner, "Only owner can mint");
        totalSupply += _value;
        balanceOf[_to] += _value;
        emit Mint(_to, _value);
        emit Transfer(address(0), _to, _value);
    }
    
    function getBalance(address _address) public view returns (uint256) {
        return balanceOf[_address];
    }
}

