"use client";

import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { useCallback, useEffect, useState } from "react";
import config from "@/config.json";
import pyusdAbi from "@/pyusdAbi.json"
import LevitatingLogo from "./logo";
import Link from "next/link";

const Modal = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-blue-900 rounded-xl p-6 max-w-md w-full mx-4 relative border border-white">
        <button
          onClick={onClose}
          className="absolute top-2 right-4 text-white hover:text-gray-300 text-2xl font-bold"
        >
          ×
        </button>
        <h2 className="text-xl font-bold mb-4 text-white pr-8">{title}</h2>
        {children}
      </div>
    </div>
  );
};

const Home = () => {
  const { address, isConnected } = useAccount();
  const { writeContract, isPending } = useWriteContract();
  const [depositAmount, setDepositAmount] = useState("");
  const [isApproveLoading, setIsApproveLoading] = useState(false);
  const [isDepositLoading, setIsDepositLoading] = useState(false);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isLevelModalOpen, setIsLevelModalOpen] = useState(false);

  // Contract reads
  const { data: isRegistered, refetch: refetchRegistration } = useReadContract({
    abi: config.abi,
    address: `0x${config.address}`,
    functionName: "isUserRegistered",
    args: [address],
  }) as { data: boolean | undefined, refetch: () => void };

  const { data: points, refetch: refetchPoints } = useReadContract({
    abi: config.abi,
    address: `0x${config.address}`,
    functionName: "getPoints",
    args: [address],
  }) as { data: bigint | undefined, refetch: () => void };

  const { data: level, refetch: refetchLevel } = useReadContract({
    abi: pyusdAbi.abi,
    address: "0xB1CC11d6197751BEbEAd9499910dE267B0A19Ed0",
    functionName: "getLevel",
    args: [address],
  }) as { data: bigint | undefined, refetch: () => void };

  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    abi: pyusdAbi.abi,
    address: "0xB1CC11d6197751BEbEAd9499910dE267B0A19Ed0",
    functionName: "checkAllowance",
    args: [address],
    enabled: !!address, // Only run when address is available
  }) as { data: bigint | undefined, refetch: () => void };

  const displayPoints = points ? points.toString() : "0";
  const displayLevel = level ? level.toString() : "0";

  // Handle PYUSD approval
  const handleApprove = useCallback(async () => {
    if (!depositAmount) return;
    
    setIsApproveLoading(true);
    try {
      await writeContract({
        abi: [
          {
            "inputs": [
              {"name": "spender", "type": "address"},
              {"name": "amount", "type": "uint256"}
            ],
            "name": "approve",
            "outputs": [{"name": "", "type": "bool"}],
            "stateMutability": "nonpayable",
            "type": "function"
          }
        ],
        address: "0xCaC524BcA292aaade2DF8A05cC58F0a65B1B3bB9",
        functionName: "approve",
        args: ["0xB1CC11d6197751BEbEAd9499910dE267B0A19Ed0", BigInt(Math.floor(parseFloat(depositAmount) * 1000000))],
      });
      // Add a small delay before refetching allowance to ensure the blockchain has updated
      setTimeout(() => {
        refetchAllowance();
      }, 1000);
    } catch (error) {
      console.error("Approval failed:", error);
    } finally {
      setIsApproveLoading(false);
    }
  }, [writeContract, depositAmount, refetchAllowance]);

  // Handle PYUSD deposit
  const handleDeposit = useCallback(async () => {
    if (!depositAmount) return;
    
    setIsDepositLoading(true);
    try {
      const depositBigInt = BigInt(Math.floor(parseFloat(depositAmount) * 1000000)); // Convert to proper decimal representation
      await writeContract({
        abi: pyusdAbi.abi,
        address: "0xB1CC11d6197751BEbEAd9499910dE267B0A19Ed0",
        functionName: "deposit",
        args: [depositBigInt],
      });
      refetchLevel();
      setDepositAmount("");
      setIsDepositModalOpen(false);
    } catch (error) {
      console.error("Deposit failed:", error);
    } finally {
      setIsDepositLoading(false);
    }
  }, [writeContract, depositAmount, refetchLevel]);

  const handleRegister = useCallback(async () => {
    try {
      await writeContract({
        abi: config.abi,
        address: `0x${config.address}`,
        functionName: "register",
      });
      refetchRegistration();
    } catch (error) {
      console.error("Registration failed:", error);
    }
  }, [writeContract, refetchRegistration]);

  const isDepositAllowed = useCallback(() => {
    if (!depositAmount || !allowance || isDepositLoading) return false;
    try {
      // Convert to BigInt only for comparison
      const depositBigInt = BigInt(Math.floor(parseFloat(depositAmount) * 1000000)); // Assuming 6 decimals for PYUSD
      const allowanceBigInt = (allowance) ;
      return depositBigInt <= allowanceBigInt;
    } catch (error) {
      console.error("Error comparing deposit amount and allowance:", error);
      return false;
    }
  }, [depositAmount, allowance, isDepositLoading]);

  useEffect(() => {
    if (isRegistered) {
      refetchPoints();
      refetchLevel();
    }
  }, [isRegistered, refetchPoints, refetchLevel]);

   const handleDepositAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow empty string or valid numbers
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setDepositAmount(value);
    }
  };

  const DepositModal = () => (
    <Modal
      isOpen={isDepositModalOpen}
      onClose={() => setIsDepositModalOpen(false)}
      title="Deposit PYUSD"
    >
      <div className="space-y-4">
        <input
          type="text" // Changed to text type for better control
          inputMode="decimal" // Better mobile keyboard for decimals
          pattern="[0-9]*\.?[0-9]*" // Restrict to valid number patterns
          value={depositAmount}
          onChange={handleDepositAmountChange}
          placeholder="Enter amount"
          className="w-full p-2 rounded bg-white text-blue-900"
        />
        <div className="flex gap-4">
          <button
            onClick={handleApprove}
            disabled={isApproveLoading || !depositAmount}
            className="bg-white hover:bg-gray-300 text-blue-800 font-bold py-2 px-4 rounded flex-1 transition-colors disabled:opacity-50"
          >
            {isApproveLoading ? "Approving..." : "Approve"}
          </button>
          <button
            onClick={handleDeposit}
            disabled={!isDepositAllowed()}
            className="bg-white hover:bg-gray-300 text-blue-800 font-bold py-2 px-4 rounded flex-1 transition-colors disabled:opacity-50"
          >
            {isDepositLoading ? "Depositing..." : "Deposit"}
          </button>
        </div>
        <div className="text-sm text-white mt-2">
          {allowance ? `Current allowance: ${(Number(allowance) / 1000000).toFixed(2)} PYUSD` : 'No allowance set'}
        </div>
      </div>
    </Modal>
  );

  const LevelModal = () => (
    <Modal
      isOpen={isLevelModalOpen}
      onClose={() => setIsLevelModalOpen(false)}
      title="Your Level Status"
    >
      <div className="text-center">
        <p className="text-4xl font-bold text-white mb-2">{displayLevel}x Multiplier</p>
        <p className="text-white text-lg">Current Level {displayLevel}</p>
        <div className="mt-6 p-4 bg-blue-800 rounded-lg">
          <p className="text-sm text-white">
            Keep depositing PYUSD to increase your level and unlock more benefits!
          </p>
        </div>
      </div>
    </Modal>
  );

  return (
    <div className="min-h-screen bg-darkblue flex flex-col justify-between items-center text-white">
      {/* Header Section */}
      <div className="w-full flex justify-between items-center py-4 px-8">
        <w3m-account-button />
        <Link 
      href="/architecture" 
      className="text-white hover:text-blue-300 transition-colors"
    >
      View Architecture
    </Link>
      </div>

      {/* Main Hero Section */}
      <div className="text-center space-y-6 mt-0 mb-16 max-w-4xl mx-auto">
        <LevitatingLogo/>
        <h1 className="text-5xl font-bold">Trust Your Chain, Build Your Name</h1>
        <p className="text-lg text-white leading-relaxed">
          RepCheck is your on-chain reputation sidekick—automatically tracking and rewarding your blockchain moves.
        </p>
      </div>

      {/* Wallet Interaction Section */}
      <div className="text-center mt-4 mb-16">
        {!isConnected ? (
          <div className="flex flex-col items-center">
            <w3m-connect-button />
            <p className="mt-4 text-lg text-white">
              Please connect your wallet to continue.
            </p>
          </div>
        ) : (
          <div className="w-full max-w-sm mx-auto">
            {isRegistered ? (
              <div className="space-y-4">
                <div className="border border-white rounded-xl p-6 bg-blue-900 shadow-lg">
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-white text-xl">Reputation Points:&nbsp;</p>
                    <p className="text-white text-2xl font-bold">
                      {displayPoints}
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setIsLevelModalOpen(true)}
                      className="bg-white hover:bg-gray-300 text-blue-800 font-bold py-2 px-4 rounded flex-1 transition-colors"
                    >
                     Level Check
                    </button>
                    <button
                      onClick={() => setIsDepositModalOpen(true)}
                      className="bg-white hover:bg-gray-300 text-blue-800 font-bold py-2 px-4 rounded flex-1 transition-colors relative flex items-center justify-center"
                    >
                      <img src="https://assets.coingecko.com/coins/images/31212/large/PYUSD_Logo_%282%29.png?1696530039" alt="Deposit Icon" className="w-6 h-6 mr-2" />
                      Deposit
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="border border-white rounded-xl p-8 bg-blue-900 shadow-lg space-y-6">
                <p className="text-white text-2xl">You are not registered 🥺</p>
                <button
                  onClick={handleRegister}
                  className="bg-white hover:bg-gray-300 text-blue-800 font-bold py-2 px-4 rounded w-full transition-colors"
                  disabled={isPending}
                >
                  {isPending ? "Registering..." : "Register"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      <DepositModal />
      <LevelModal />

      {/* Key Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto text-left">
        <div className="border border-white rounded-lg p-6 bg-blue-900 shadow-lg">
          <h3 className="text-2xl font-bold text-white mb-2">Lightning-Fast Transaction Monitoring</h3>
          <p className="text-white">
            Stay ahead with real-time on-chain activity tracking, powered by Quicknode Streams—delivering blockchain data at the speed of now.
          </p>
        </div>
        <div className="border border-white rounded-lg p-6 bg-blue-900 shadow-lg">
          <h3 className="text-2xl font-bold text-white mb-2">Seamless Point Attribution</h3>
          <p className="text-white">
            Automatically award reputation points using Quicknode Functions to effortlessly filter and process blockchain data based on the rules.
          </p>
        </div>
        <div className="border border-white rounded-lg p-6 bg-blue-900 shadow-lg">
          <h3 className="text-2xl font-bold text-white mb-2">Immutable On-Chain Reputation</h3>
          <p className="text-white">
            Your reputation points are locked on-chain, forever transparent and secure—ensuring fairness and trust in every transaction.
          </p>
        </div>
        <div className="border border-white rounded-lg p-6 bg-blue-900 shadow-lg">
          <h3 className="text-2xl font-bold text-white mb-2">Effortless User Management & Logging</h3>
          <p className="text-white">
            Manage users and track events with ease. Our system ensures that every action is logged and every point is accounted for.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="w-full py-4 bg-blue-900 text-center">
        <p className="text-white text-sm">
          © {new Date().getFullYear()} RepCheck - Building Trust on Blockchain
        </p>
      </div>
    </div>
  );
};

export default Home;