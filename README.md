# RepCheck: Blockchain-Based Reputation System

RepTracker is an innovative reputation tracking system that automatically monitors and rewards user activities on the blockchain using Quicknode's cutting-edge Streams and Functions technologies. The system assigns reputation points to users based on their on-chain activities, creating a transparent and automated reputation mechanism.

## Features

- **Automated Transaction Monitoring**: Leverages Quicknode Streams to track registered users' blockchain activities in real-time
- **Smart Point Attribution**: Uses Quicknode Functions to process transactions and award points automatically
- **Flexible Administration**: Admin-controlled point system with batch operations support
- **On-Chain Reputation**: All reputation points are stored on-chain for transparency and immutability
- **User Management**: Complete system for user registration and tracking
- **Event Logging**: Comprehensive event emission for all major actions

## Technical Architecture

![image](https://github.com/user-attachments/assets/d87ebb04-6cce-4f5b-8391-36cd72bedbb0)


### Smart Contract
The system is built on a Solidity smart contract (`RepTracker.sol`) that handles:
- User registration and management
- Point allocation and tracking
- Administrative controls
- Batch operations for efficiency

### Integration Components
1. **Quicknode Streams**
   - Monitors blockchain transactions in real-time
   - Filters transactions for registered users
   - Triggers point attribution workflows

2. **Quicknode Functions**
   - Processes transaction data
   - Determines point values based on transaction characteristics
   - Interacts with the smart contract to award points

## Smart Contract Functions

### User Management
- `register()`: Allow users to register themselves in the system
- `isUserRegistered(address)`: Check if a user is registered
- `getAllUsers()`: Retrieve all registered users
- `getUserCount()`: Get total number of registered users
- `getUserDetails(address)`: Get detailed information about a user

### Point System
- `awardPoints(address, int256, string)`: Award points to a single user
- `batchAwardPoints(address[], int256[], string[])`: Award points to multiple users
- `getPoints(address)`: Get points for a specific user

### Administration
- `changeAdmin(address)`: Transfer admin rights to a new address

## Events
- `UserRegistered(address user)`
- `PointsAwarded(address user, int256 points, string reason)`
- `AdminChanged(address oldAdmin, address newAdmin)`

## Setup and Deployment

1. **Prerequisites**
   - Node.js and npm installed
   - Quicknode account with API access
   - Ethereum wallet with network tokens

2. **Contract Deployment**
   ```bash
   # Install dependencies
   npm install

   # Deploy contract
   npx hardhat run scripts/deploy.js --network <your-network>
   ```

3. **Quicknode Configuration**
   - Set up Quicknode Streams to monitor your target network
   - Configure stream filters for registered users
   - Deploy Quicknode Functions for transaction processing

## Security Considerations

- Admin-only functions are protected with `onlyAdmin` modifier
- User registration checks prevent duplicate registrations
- Point awards are validated to prevent zero-point transactions
- Array length validation in batch operations
- Address validation in admin changes

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Disclaimer

This system is in active development. Please audit and test thoroughly before any production use.
