// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title SimpleVoting
 * @dev A simple voting system where users can vote for candidates
 */
contract Voting {
    struct Candidate {
        string name;
        uint256 voteCount;
    }
    
    Candidate[] public candidates;
    mapping(address => bool) public hasVoted;
    address public owner;
    bool public votingEnded;
    
    event VoteCast(address indexed voter, uint256 candidateIndex);
    event VotingEnded(uint256 winnerIndex);
    event CandidateAdded(string name, uint256 index);
    
    constructor() {
        owner = msg.sender;
        votingEnded = false;
    }
    
    function addCandidate(string memory _name) public {
        require(msg.sender == owner, "Only owner can add candidates");
        require(!votingEnded, "Voting has ended");
        require(bytes(_name).length > 0, "Candidate name cannot be empty");
        
        candidates.push(Candidate({
            name: _name,
            voteCount: 0
        }));
        
        emit CandidateAdded(_name, candidates.length - 1);
    }
    
    function vote(uint256 _candidateIndex) public {
        require(!votingEnded, "Voting has ended");
        require(!hasVoted[msg.sender], "You have already voted");
        require(_candidateIndex < candidates.length, "Invalid candidate");
        
        hasVoted[msg.sender] = true;
        candidates[_candidateIndex].voteCount++;
        
        emit VoteCast(msg.sender, _candidateIndex);
    }
    
    function getCandidate(uint256 _index) public view returns (string memory name, uint256 voteCount) {
        require(_index < candidates.length, "Candidate does not exist");
        return (candidates[_index].name, candidates[_index].voteCount);
    }
    
    function getCandidateCount() public view returns (uint256) {
        return candidates.length;
    }
    
    function getWinner() public view returns (uint256 winnerIndex, string memory winnerName, uint256 votes) {
        require(votingEnded, "Voting has not ended");
        require(candidates.length > 0, "No candidates");
        
        uint256 maxVotes = 0;
        uint256 winner = 0;
        
        for (uint256 i = 0; i < candidates.length; i++) {
            if (candidates[i].voteCount > maxVotes) {
                maxVotes = candidates[i].voteCount;
                winner = i;
            }
        }
        
        return (winner, candidates[winner].name, candidates[winner].voteCount);
    }
    
    function endVoting() public {
        require(msg.sender == owner, "Only owner can end voting");
        require(!votingEnded, "Voting already ended");
        require(candidates.length > 0, "No candidates to vote for");
        
        votingEnded = true;
        
        (uint256 winnerIndex, , ) = getWinner();
        emit VotingEnded(winnerIndex);
    }
    
    function hasUserVoted(address _user) public view returns (bool) {
        return hasVoted[_user];
    }
}

