solidityCopy code
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract BalanceManager {
    mapping(address => uint256) public userBalances;  // Track user native token credits

    event FundsWithdrawn(address user, uint256 amount);
    event FundAdded(address user, uint256 amount);

    function addToBalance(address user, uint256 amount) internal {
        userBalances[user] += amount;
        emit FundAdded(user, amount);
    }

    function subtractFromBalance(address user, uint256 amount) internal {
        require(userBalances[user] >= amount, "Insufficient funds");
        userBalances[user] -= amount;
    }

    function deposit() public payable {
        addToBalance(msg.sender, msg.value);
    }

    function withdraw(uint256 amount) public {
        subtractFromBalance(msg.sender, amount);
        payable(msg.sender).transfer(amount);
        emit FundsWithdrawn(msg.sender, amount);
    }
}
