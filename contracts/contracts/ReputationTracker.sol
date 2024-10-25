// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract RepTracker {
    // State variables
    address public admin;
    address[] public registeredUsers;
    mapping(address => bool) public isRegistered;
    mapping(address => int256) public userPoints;
    
    // Events
    event UserRegistered(address user);
    event PointsAwarded(address user, int256 points, string reason);
    event AdminChanged(address oldAdmin, address newAdmin);

    error NotAdmin();
    error UserNotRegistered();
    error UserAlreadyRegistered();
    error InvalidPointsAmount();

    constructor() {
        admin = msg.sender;
    }

    // Modifier to restrict admin-only functions
    modifier onlyAdmin() {
        if (msg.sender != admin) revert NotAdmin();
        _;
    }

    // Modifier to check if user is registered
    modifier userExists(address user) {
        if (!isRegistered[user]) revert UserNotRegistered();
        _;
    }

    // Function to register a user
    function register() public {
        if (isRegistered[msg.sender]) revert UserAlreadyRegistered();
        
        registeredUsers.push(msg.sender);
        isRegistered[msg.sender] = true;
        userPoints[msg.sender] = 0;
        
        emit UserRegistered(msg.sender);
    }

    // Function for admin to award points
    function awardPoints(
        address user,
        int256 points,
        string memory reason
    ) public onlyAdmin userExists(user) {
        if (points == 0) revert InvalidPointsAmount();
        
        userPoints[user] += points;
        emit PointsAwarded(user, points, reason);
    }

    // Function to award points to multiple users at once
    function batchAwardPoints(
        address[] memory users,
        int256[] memory points,
        string[] memory reasons
    ) public onlyAdmin {
        require(
            users.length == points.length && points.length == reasons.length,
            "Arrays length mismatch"
        );

        for (uint i = 0; i < users.length; i++) {
            if (isRegistered[users[i]] && points[i] != 0) {
                userPoints[users[i]] += points[i];
                emit PointsAwarded(users[i], points[i], reasons[i]);
            }
        }
    }

    // Function to get points for a specific user
    function getPoints(address user) public view returns (int256) {
        return userPoints[user];
    }

    // Function to get all registered users
    function getAllUsers() public view returns (address[] memory) {
        return registeredUsers;
    }

    // Function to check if a user is registered
    function isUserRegistered(address _user) public view returns (bool) {
        return isRegistered[_user];
    }

    // Function to get user count
    function getUserCount() public view returns (uint256) {
        return registeredUsers.length;
    }

    // Function to change admin
    function changeAdmin(address newAdmin) public onlyAdmin {
        require(newAdmin != address(0), "Invalid address");
        emit AdminChanged(admin, newAdmin);
        admin = newAdmin;
    }

    // Function to get user details
    function getUserDetails(address user) 
        public 
        view 
        returns (
            bool registered,
            int256 points
        ) 
    {
        return (
            isRegistered[user],
            userPoints[user]
        );
    }
}