// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title MessageBoard
 * @dev A simple message board where anyone can post messages
 */
contract MessageBoard {
    struct Message {
        address author;
        string content;
        uint256 timestamp;
        uint256 id;
    }
    
    Message[] public messages;
    uint256 public messageCount;
    
    event MessagePosted(uint256 indexed id, address indexed author, string content, uint256 timestamp);
    
    function postMessage(string memory _content) public {
        require(bytes(_content).length > 0, "Message cannot be empty");
        require(bytes(_content).length <= 280, "Message too long (max 280 chars)");
        
        messageCount++;
        messages.push(Message({
            author: msg.sender,
            content: _content,
            timestamp: block.timestamp,
            id: messageCount
        }));
        
        emit MessagePosted(messageCount, msg.sender, _content, block.timestamp);
    }
    
    function getMessage(uint256 _index) public view returns (
        address author,
        string memory content,
        uint256 timestamp,
        uint256 id
    ) {
        require(_index < messages.length, "Message does not exist");
        Message memory message = messages[_index];
        return (message.author, message.content, message.timestamp, message.id);
    }
    
    function getTotalMessages() public view returns (uint256) {
        return messages.length;
    }
    
    function getLatestMessage() public view returns (
        address author,
        string memory content,
        uint256 timestamp,
        uint256 id
    ) {
        require(messages.length > 0, "No messages yet");
        Message memory latest = messages[messages.length - 1];
        return (latest.author, latest.content, latest.timestamp, latest.id);
    }
}

