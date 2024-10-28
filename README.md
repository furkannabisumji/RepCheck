# RepCheck: Trust Your Chain, Build Your Name
![image](https://github.com/user-attachments/assets/0ca40434-889f-429d-95c3-ae0baef1293f)

RepCheck is an innovative DeFi reputation system that automatically monitors and rewards user activities across various DeFi protocols. Built on a custom Avail-powered rollup called RepChain, the system leverages Quicknode's Streams and Functions technologies to track and reward DeFi interactions, creating a transparent and automated reputation mechanism.

## Features

![image](https://github.com/user-attachments/assets/aa62679e-e3b9-426a-90e9-24169b5c0507)

- **DeFi Protocol Integration**: 
  - Uniswap swap tracking
  - Aave lending protocol interactions (borrow, repay, supply)
  - PYUSD staking for point multipliers
- **Automated Transaction Monitoring**: Leverages Quicknode Streams to track registered users' DeFi activities in real-time
- **Smart Point Attribution**: Uses Quicknode Functions to process transactions and award points automatically
- **Custom Rollup Infrastructure**: Deployed on RepChain, an Avail-powered rollup for optimal scalability
- **Point Multiplier System**: PYUSD staking mechanism for enhanced point earnings
- **On-Chain Reputation**: All reputation points are stored on-chain for transparency and immutability
- **Comprehensive Event Logging**: Detailed event emission for all major actions

## Technical Architecture

![Screenshot 2024-10-29 014316](https://github.com/user-attachments/assets/9b35277f-2f85-48fb-928b-3769de893568)

### Smart Contract
The system is built on a Solidity smart contract that handles:
- User registration and management
- Point allocation and tracking
- DeFi interaction monitoring
- PYUSD staking and multiplier calculations
- Administrative controls
- Batch operations for efficiency

### Integration Components
![image](https://github.com/user-attachments/assets/bf0504b3-66f4-4b09-977d-c3ba275fde61)

1. **Quicknode Streams**
   - Monitors DeFi protocol interactions in real-time
   - Tracks Uniswap and Aave transactions
   - Filters transactions for registered users
   - Triggers point attribution workflows

2. **Quicknode Functions**
   - Processes DeFi transaction data
   - Calculates point values based on transaction types and volumes
   - Reads of PYUSD Escrow for multipliers
   - Interacts with the smart contract to award points

### Appchain integration for speed, efficiency and security

Repchain - https://explorer.reponchain.com/

![image](https://github.com/user-attachments/assets/7019787d-f505-4a38-ab75-a586fc723c19)


## Important Smart Contract Functions

- `awardPoints(address, int256, string)` (RepTracker): Award points to a single user
- `batchAwardPoints(address[], int256[], string[])`(RepTracker): Award points to multiple users
- `getPoints(address)`(RepTracker): Get points for a specific user
- `getLevel(address)`(PYUSD_Escrow): Get user's current point multiplier


This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Disclaimer

This system is in active development. Please audit and test thoroughly before any production use. DeFi protocol interactions and PYUSD staking mechanisms should be carefully reviewed for security vulnerabilities.
