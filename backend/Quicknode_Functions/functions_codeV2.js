const { Web3 } = require("web3");
const axios = require("axios");
const ethers = require("ethers");

// Define the contract ABI (Application Binary Interface)
const abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        internalType: "int256",
        name: "points",
        type: "int256",
      },
      {
        internalType: "string",
        name: "reason",
        type: "string",
      },
    ],
    name: "awardPoints",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "users",
        type: "address[]",
      },
      {
        internalType: "int256[]",
        name: "points",
        type: "int256[]",
      },
      {
        internalType: "string[]",
        name: "reasons",
        type: "string[]",
      },
    ],
    name: "batchAwardPoints",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newAdmin",
        type: "address",
      },
    ],
    name: "changeAdmin",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "InvalidPointsAmount",
    type: "error",
  },
  {
    inputs: [],
    name: "NotAdmin",
    type: "error",
  },
  {
    inputs: [],
    name: "UserAlreadyRegistered",
    type: "error",
  },
  {
    inputs: [],
    name: "UserNotRegistered",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "oldAdmin",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "newAdmin",
        type: "address",
      },
    ],
    name: "AdminChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "int256",
        name: "points",
        type: "int256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "reason",
        type: "string",
      },
    ],
    name: "PointsAwarded",
    type: "event",
  },
  {
    inputs: [],
    name: "register",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "UserRegistered",
    type: "event",
  },
  {
    inputs: [],
    name: "admin",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getAllUsers",
    outputs: [
      {
        internalType: "address[]",
        name: "",
        type: "address[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "getPoints",
    outputs: [
      {
        internalType: "int256",
        name: "",
        type: "int256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getUserCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "user",
        type: "address",
      },
    ],
    name: "getUserDetails",
    outputs: [
      {
        internalType: "bool",
        name: "registered",
        type: "bool",
      },
      {
        internalType: "int256",
        name: "points",
        type: "int256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "isRegistered",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_user",
        type: "address",
      },
    ],
    name: "isUserRegistered",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "registeredUsers",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "userPoints",
    outputs: [
      {
        internalType: "int256",
        name: "",
        type: "int256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

let provider = new ethers.JsonRpcProvider(
  "https://radial-red-breeze.ethereum-sepolia.quiknode.pro/b0889c7d0a35d0f4df1a4ad8d36c4dc7341ed119"
);

const contractAddress = "0x03AdA6F4BaE36d152Fd33A3a11CA9E1feDEEeCbc";

const wallet = new ethers.Wallet(
  "d9bb5f232bac6821233db42d4735acb56692052202eb0f439acf127d693dc621",
  provider
);

const repTrackerContractWithAdmin = new ethers.Contract(
  contractAddress,
  abi,
  wallet
);

async function setupWeb3() {
  web3 = new Web3(BASE_QUICKNODE_URL);
}

// Define the function to call getAllUsers
async function getAllRegisteredUsers() {
  try {
    // Create a new contract instance
    const repTrackerContract = new ethers.Contract(
      contractAddress,
      abi,
      provider
    );

    // Call the getAllUsers function from the contract
    let allUsers = await repTrackerContract.getAllUsers();

    // Log the result to the console
    console.log(allUsers);

    // Return the users if you need to use them further
    return JSON.stringify(allUsers);
  } catch (error) {
    console.error("Error fetching users:", error);
  }
}

async function sendToWebhook(data) {
  try {
    await axios.post(
      "https://webhook-test.com/2a4b4999d1683f112b4a534ae8dadb8a",
      data
    );
    console.log("Data sent to webhook successfully");
  } catch (error) {
    console.error("Error sending data to webhook:", error);
  }
}

async function main(params) {
  try {
    //   return {
    //     status: 'Data processed and sent to webhook'
    // };

    if (params?.data?.result) {
      try {
        let results = JSON.parse(await getAllRegisteredUsers());
        // await sendToWebhook(params.data);
        //         await sendToWebhook(results);

        //  return {
        //   status: "Data processed and sent to webhook",
        // };

        let results2 = results.map((v) => v.toLowerCase());

        for (let i = 0; i < params.data.result.length; i++) {
          if (results2.includes(params.data.result[i].fromUser)) {
            await repTrackerContractWithAdmin.awardPoints(
              params.data.result[i].fromUser,
              20,
              "Uniswap Swap Reputation"
            );

            await sendToWebhook(params.data);
            return {
              status: "Data processed, point awarded and sent to webhook",
            };
          }
        }

        // Ensure the sendToWebhook function completes before returning success

        // Return success only after webhook call succeeds
        return {
          status: "Data reached and sent to webhook",
        };
      } catch (e) {
        // Log the error and return a meaningful response
        console.log(e);
        return {
          status: "Error sending data to webhook",
          error: e.message,
        };
      }
    }
    if (
      params?.data?.borrowers?.length > 0 ||
      params?.data?.suppliers?.length > 0 ||
      params?.data?.repayers?.length > 0
    ) {
      // Create a combined array of all non-empty entities
      let switchVar =
        params?.data?.borrowers?.length > 0
          ? 0
          : params?.data?.suppliers?.length > 0
          ? 1
          : 2;

      let results = JSON.parse(await getAllRegisteredUsers());


      let results2 = results.map((v) => v.toLowerCase());
      const combinedData = [
        ...params?.data?.borrowers, // Spread borrowers array
        ...params?.data?.suppliers, // Spread suppliers array
        ...params?.data?.repayers, // Spread repayers array
      ];

     

      // Loop through each object (borrower, supplier, or repayer)
      for (const entity of combinedData) {
        const { block, borrower, transactionHash } = entity;

        // Check if the borrower (or supplier, repayer) exists in results2
        if (results2.includes(borrower)) {
          // Award points (replace with appropriate logic)

          if (switchVar == 0) {
            // If there are borrow transactions, award points for borrowing

            await repTrackerContractWithAdmin.awardPoints(
              borrower, // Borrower's address
              10, // Points to award
              "Aave Borrow Transaction Reputation: Borrow" // Description for borrowing
            );
          } else if (switchVar == 1) {
            // If there are supply transactions, award points for supplying
            await repTrackerContractWithAdmin.awardPoints(
              borrower, // Supplier's address (same field name as borrower in your data)
              200, // Points to award
              "Aave Supply Transaction Reputation: Supply" // Description for supplying
            );
          } else if (switchVar == 2) {
            // If there are repay transactions, award points for repaying
            await repTrackerContractWithAdmin.awardPoints(
              borrower, // Repayer's address
              100, // Points to award
              "Aave Repay Transaction Reputation: Repay" // Description for repaying
            );
          }

          // Prepare the params for the webhook call
          const params = {
            block,
            borrower,
            transactionHash,
          };

          // Call the webhook
          await sendToWebhook(params);

          return {
            status: "Data processed, points awarded, and sent to webhook",
          };
        }
      }

      return {
        status: "No matching addresses in results2",
      };
    }

    return {
      status: "Proceeding forward",
    };
  } catch (error) {
    console.error("Error in main function:", error);
    return {
      status: "Error processing data",
      error: error.message,
    };
  }
}

exports.main = main;
