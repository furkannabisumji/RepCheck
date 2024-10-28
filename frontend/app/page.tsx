"use client";

import { useAccount, useReadContract, useWriteContract, useChainId } from "wagmi";
import { useCallback, useEffect, useState } from "react";
import config from "@/config.json";
import pyusdAbi from "@/pyusdAbi.json"
import LevitatingLogo from "./logo";
import Link from "next/link";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title }) => {
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
  const chainId = useChainId(); // Get the current chain ID using the hook
  const [depositAmount, setDepositAmount] = useState("");
  const [isApproveLoading, setIsApproveLoading] = useState(false);
  const [isDepositLoading, setIsDepositLoading] = useState(false);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isLevelModalOpen, setIsLevelModalOpen] = useState(false);
  
  const isSepolia = chainId === 11155111;


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
  );const StatsCard = ({ title, value, icon }: { title: string; value: string; icon?: React.ReactNode }) => (
    <div className="bg-blue-800/50 rounded-xl p-6 backdrop-blur-sm border border-blue-400/30 hover:border-blue-400/50 transition-all">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-blue-200 text-sm mb-1">{title}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
        </div>
        {icon && <div className="text-blue-200">{icon}</div>}
      </div>
    </div>
  );

  const ActionButton = ({ onClick, icon, children, disabled = false }: { 
    onClick: () => void; 
    icon?: React.ReactNode; 
    children: React.ReactNode;
    disabled?: boolean;
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 
                 text-white font-medium py-3 px-6 rounded-lg w-full transition-all 
                 flex items-center justify-center space-x-2 disabled:opacity-50 
                 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
    >
      {icon && <span className="w-5 h-5">{icon}</span>}
      <span>{children}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-darkblue to-blue-900 flex flex-col justify-between items-center text-white">
      {/* Header Section */}
      <div className="w-full flex justify-between items-center py-6 px-8 bg-blue-900/30 backdrop-blur-sm border-b border-blue-400/10">
        <w3m-account-button />
        <Link 
          href="/architecture" 
          className="text-blue-200 hover:text-white transition-colors"
        >
          View Architecture
        </Link>
      </div>

      {/* Main Hero Section */}
      <div className="text-center space-y-6 mt-12 mb-16 max-w-4xl mx-auto px-4">
        <LevitatingLogo/>
        <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-white">
          Trust Your Chain, Build Your Name
        </h1>
        <p className="text-lg text-blue-200 leading-relaxed max-w-2xl mx-auto">
          RepCheck is your on-chain reputation sidekick—automatically tracking and rewarding your blockchain moves.
        </p>
      </div>

      {/* Wallet Interaction Section - Redesigned */}
      <div className="w-full max-w-4xl mx-auto px-4 mb-16">
        {!isConnected ? (
          <div className="flex flex-col items-center space-y-6 p-8 bg-blue-800/30 rounded-2xl backdrop-blur-sm border border-blue-400/30">
            <div className="w-full max-w-md text-center space-y-4">
              <h2 className="text-2xl font-bold text-white mb-4">Welcome to RepCheck</h2>
              <p className="text-blue-200 mb-6">Connect your wallet to start building your on-chain reputation</p>
              <w3m-connect-button />
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {isRegistered ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {!isSepolia && (
                  <StatsCard 
                    title="Reputation Points" 
                    value={displayPoints}
                    icon={<span className="text-2xl">⭐</span>}
                  />
                )}
                {isSepolia && (
                  <>
                    <StatsCard 
                      title="Current Level" 
                      value={`Level ${displayLevel}`}
                      icon={<span className="text-2xl">🏆</span>}
                    />
                    <StatsCard 
                      title="Multiplier" 
                      value={`${displayLevel}x`}
                      icon={<span className="text-2xl">✨</span>}
                    />
                    <div className="col-span-full md:col-span-1 flex flex-col space-y-4">
                      <ActionButton 
                        onClick={() => setIsLevelModalOpen(true)}
                        icon={<span className="text-xl">📊</span>}
                      >
                        Check Level Status
                      </ActionButton>
                      <ActionButton 
                        onClick={() => setIsDepositModalOpen(true)}
                        icon={<img src="https://assets.coingecko.com/coins/images/31212/large/PYUSD_Logo_%282%29.png?1696530039" alt="PYUSD" className="w-5 h-5" />}
                      >
                        Deposit PYUSD
                      </ActionButton>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="bg-blue-800/30 rounded-2xl p-8 backdrop-blur-sm border border-blue-400/30">
                {isSepolia ? (
                  <div className="text-center space-y-4">
                    <p className="text-xl text-blue-200">Connect to the RepChain for registration</p>
                  </div>
                ) : (
                  <div className="text-center space-y-4">
                    <h3 className="text-2xl font-bold text-white">Start Your Reputation Journey</h3>
                    <p className="text-blue-200 mb-6">Register now to begin tracking your on-chain reputation</p>
                    <div className="max-w-md mx-auto">
                      <ActionButton
                        onClick={handleRegister}
                        disabled={isPending}
                        icon={<span className="text-xl">🚀</span>}
                      >
                        {isPending ? "Registering..." : "Register Now"}
                      </ActionButton>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      <DepositModal />
      <LevelModal />

      {/* Key Features Section - Enhanced */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto px-4 mb-16">
        <div className="bg-blue-800/30 rounded-xl p-6 backdrop-blur-sm border border-blue-400/30 hover:border-blue-400/50 transition-all">
          <h3 className="text-2xl font-bold text-white mb-3">Lightning-Fast Transaction Monitoring</h3>
          <p className="text-blue-200">
            Stay ahead with real-time on-chain activity tracking, powered by Quicknode Streams—delivering blockchain data at the speed of now.
          </p>
        </div>
        <div className="bg-blue-800/30 rounded-xl p-6 backdrop-blur-sm border border-blue-400/30 hover:border-blue-400/50 transition-all">
          <h3 className="text-2xl font-bold text-white mb-3">Seamless Point Attribution</h3>
          <p className="text-blue-200">
            Automatically award reputation points using Quicknode Functions to effortlessly filter and process blockchain data based on the rules.
          </p>
        </div>
        <div className="bg-blue-800/30 rounded-xl p-6 backdrop-blur-sm border border-blue-400/30 hover:border-blue-400/50 transition-all">
          <h3 className="text-2xl font-bold text-white mb-3">Immutable On-Chain Reputation</h3>
          <p className="text-blue-200">
            Your reputation points are locked on-chain, forever transparent and secure—ensuring fairness and trust in every transaction.
          </p>
        </div>
        <div className="bg-blue-800/30 rounded-xl p-6 backdrop-blur-sm border border-blue-400/30 hover:border-blue-400/50 transition-all">
          <h3 className="text-2xl font-bold text-white mb-3">Effortless User Management & Logging</h3>
          <p className="text-blue-200">
            Manage users and track events with ease. Our system ensures that every action is logged and every point is accounted for.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="w-full py-6 bg-blue-900/30 backdrop-blur-sm border-t border-blue-400/10 text-center">
        <p className="text-blue-200 text-sm">
          © {new Date().getFullYear()} RepCheck - Building Trust on Blockchain
        </p>
      </div>
    </div>
  );
};

export default Home;