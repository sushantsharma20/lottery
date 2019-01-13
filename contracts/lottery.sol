pragma solidity ^0.4.25;

contract Lottery{
    address public manager;
    address[] public players;

    constructor() public{
        manager = msg.sender;
    }

    function enter() public payable{
        require(msg.value > 0.01 ether);
        players.push(msg.sender);

    }

    function pickWinner() public restricted{
        uint winner = random()%players.length;
        players[winner].transfer(address(this).balance);
        players = new address[](0);
    }

    function random() private view returns(uint){
        return uint(keccak256(abi.encodePacked(now,players,block.difficulty)));
    }

    function getPlayers() public view returns(address[]){
        return players;
    }

    modifier restricted() {
        require(manager == msg.sender);
        _;
    }

}