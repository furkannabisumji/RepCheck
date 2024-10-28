// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

interface IPYUSD {
    function approve(address spender, uint256 amount) external returns (bool);

    function allowance(address owner, address spender)
        external
        view
        returns (uint256);

    function balanceOf(address account) external view returns (uint256);

    function transfer(address to, uint256 amount) external returns (bool);

    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external returns (bool);

    function totalSupply() external view returns (uint256);
}

contract PYUSD_Escrow is ReentrancyGuard {
    IPYUSD public pyusd;

    // Balance mapping
    mapping(address => uint256) public balances;

    // Events
    event Deposited(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);

    constructor(address _token) {
        pyusd = IPYUSD(_token);
    }

    // Helper function to check allowance
    function checkAllowance(address user) external view returns (uint256) {
        return pyusd.allowance(user, address(this));
    }

    function deposit(uint256 amount) external nonReentrant {
        require(amount > 0, "Cannot deposit 0");

        // Check if the contract has enough allowance to spend the user's tokens
        require(
            pyusd.allowance(msg.sender, address(this)) >= amount,
            "Allowance insufficient"
        );             
    
         pyusd.transferFrom(msg.sender, address(this), amount);
        // Update the user's balance in the escrow contract
        balances[msg.sender] += amount;

        emit Deposited(msg.sender, amount);
    }

    function withdraw(uint256 amount) external nonReentrant {
        require(amount > 0, "Cannot withdraw 0");
        require(balances[msg.sender] >= amount, "Insufficient balance");

        balances[msg.sender] -= amount;
        require(pyusd.transfer(msg.sender, amount), "Transfer failed");

        emit Withdrawn(msg.sender, amount);
    }

    function getBalance(address user) external view returns (uint256) {
        return balances[user];
    }

    function getLevel(address user) external view returns (uint256) {
        uint256 balance = balances[user];

        if (balance >= 20 * 10**6) {
            return 4; // Level 4 for 20+ PYUSD
        } else if (balance >= 10 * 10**6) {
            return 3; // Level 3 for 10+ PYUSD
        } else if (balance >= 5 * 10**6) {
            return 2; // Level 2 for 5+ PYUSD
        }
        return 1;
    }

    function getPYUSDBalance(address user) external view returns (uint256) {
        return pyusd.balanceOf(user);
    }

    function getTotalPYUSDSupply() external view returns (uint256) {
        return pyusd.totalSupply();
    }
}
