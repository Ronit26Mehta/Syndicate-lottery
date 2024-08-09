// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./BalanceManager.sol";

contract LottoLux is BalanceManager {

    struct Lottery {
        address creator;
        uint256 prizePool;
        uint256 ticketPrice;
        string name;
        uint256 creatorReward;
        mapping(address => uint256) ticketAmount;
        address[] participants;
        mapping(address => uint256) winners;
    }

    mapping(uint256 => Lottery) public lotteries;
    mapping(address => uint256) public loyaltyPoints;
    
    uint256 public currentLotteryId = 0;
    uint256 public constant CREATOR_REWARD_PERCENTAGE = 10;
    uint256 public constant FEE_PERCENTAGE = 1;

    event LotteryCreated(uint256 lotteryId, address creator, uint256 ticketPrice);
    event TicketPurchased(uint256 lotteryId, address participant);
    event LotteryDistributed(uint256 lotteryId);

    function createLottery(string memory _name, uint256 _ticketPrice, uint256 _prizePool) external payable {
        require(msg.value == _prizePool, "Amount sent doesn't match the prize pool.");

        Lottery storage lottery = lotteries[++currentLotteryId];
        lottery.creator = msg.sender;
        lottery.ticketPrice = _ticketPrice;
        lottery.prizePool = _prizePool;
        lottery.name = _name;
        lottery.creatorReward = (_prizePool * CREATOR_REWARD_PERCENTAGE) / 100;

        emit LotteryCreated(currentLotteryId, msg.sender, _ticketPrice);
    }

    function purchaseTicket(uint256 lotteryId) external payable {
        Lottery storage lottery = lotteries[lotteryId];
        require(msg.value == lottery.ticketPrice, "Incorrect ticket price");

        lottery.ticketAmount[msg.sender] += msg.value;

        if(lottery.ticketAmount[msg.sender] == msg.value) {
            lottery.participants.push(msg.sender);
        }

        loyaltyPoints[msg.sender] += msg.value;
        emit TicketPurchased(lotteryId, msg.sender);
    }

    function distributePrizes(uint256 lotteryId) external {
        Lottery storage lottery = lotteries[lotteryId];
        require(msg.sender == lottery.creator, "Only creator can distribute prizes");

        uint256 totalFee = (lottery.prizePool * FEE_PERCENTAGE) / 100;
        uint256 distributablePool = lottery.prizePool - totalFee - lottery.creatorReward;

        for (uint i = 0; i < lottery.participants.length; i++) {
            address participant = lottery.participants[i];

            uint256 prize = calculatePrize(participant, lotteryId);
            lottery.winners[participant] = prize;

            uint256 loyaltyPercentage = (prize * 100) / distributablePool;
            uint256 pointsToSubtract = (loyaltyPoints[participant] * loyaltyPercentage) / 100;
            loyaltyPoints[participant] -= pointsToSubtract;
        }

        emit LotteryDistributed(lotteryId);
    }

    function calculatePrize(address participant, uint256 lotteryId) internal view returns(uint256) {
        Lottery storage lottery = lotteries[lotteryId];
        
        uint256 totalLoyaltyPoints = 0;
        for (uint256 i = 0; i < lottery.participants.length; i++) {
            totalLoyaltyPoints += loyaltyPoints[lottery.participants[i]];
        }

        uint256 baseShare = (lottery.prizePool * loyaltyPoints[participant]) / totalLoyaltyPoints;
        uint256 randomBias = 80 + random(lotteryId) % 41;
        uint256 finalPrize = (baseShare * randomBias) / 100;

        return finalPrize;
    }

    function random(uint256 seed) private view returns(uint256) {
        return uint256(keccak256(abi.encodePacked(block.timestamp, seed)));
    }

    function getAllLotteries() external view returns(uint256[] memory, string[] memory, uint256[] memory, uint256[] memory) {
        uint256[] memory ids = new uint256[](currentLotteryId);
        string[] memory names = new string[](currentLotteryId);
        uint256[] memory prizePools = new uint256[](currentLotteryId);
        uint256[] memory ticketPrices = new uint256[](currentLotteryId);

        for(uint256 i = 1; i <= currentLotteryId; i++) {
            Lottery storage lottery = lotteries[i];
            ids[i-1] = i;
            names[i-1] = lottery.name;
            prizePools[i-1] = lottery.prizePool;
            ticketPrices[i-1] = lottery.ticketPrice;
        }

        return (ids, names, prizePools, ticketPrices);
    }
}
