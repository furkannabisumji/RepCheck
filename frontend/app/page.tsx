"use client";

import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { useCallback, useEffect } from "react";
import config from "@/config.json";
import LevitatingLogo from "./logo";

const Home = () => {
  const { address, isConnected } = useAccount();
  const { writeContract, isPending } = useWriteContract();

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

  const displayPoints = points ? points.toString() : "0";

  // Optimized registration handler with proper error handling
  const handleRegister = useCallback(async () => {
    try {
      await writeContract({
        abi: config.abi,
        address: `0x${config.address}`,
        functionName: "register",
      });
      // Immediately refetch data after registration
      refetchRegistration();
    } catch (error) {
      console.error("Registration failed:", error);
    }
  }, [writeContract, refetchRegistration]);

  // Effect to refetch points when registration status changes
  useEffect(() => {
    if (isRegistered) {
      refetchPoints();
    }
  }, [isRegistered, refetchPoints]);

  return (
    <div className="min-h-screen bg-darkblue flex flex-col justify-between items-center text-white">
      {/* Header Section */}
      <div className="w-full flex justify-between items-center py-4 px-8">
        {/* Wallet Connect Button */}
        <div>
          <w3m-account-button />
        </div>
      </div>

      {/* Main Hero Section */}
      <div className="text-center space-y-6 mt-0 mb-16 max-w-4xl mx-auto">
        {/* <img
          src="LogoRepCheck.png"
          alt="Logo"
          className="h-40 w-auto object-contain mx-auto animate-pulse"
          loading="eager"
          fetchPriority="high"
        /> */}
        <LevitatingLogo/>

        <h1 className="text-5xl font-bold">Trust Your Chain, Build Your Name</h1>
        <p className="text-lg text-white leading-relaxed">
          RepCheck is your on-chain reputation sidekick—automatically tracking and rewarding your blockchain moves. Powered by cutting-edge tech, we bring you a transparent, unbreakable, and fair way to build and own your rep in the crypto world.
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
              <div className="border border-white rounded-xl p-6 bg-blue-900 shadow-lg">
                <div className="flex justify-between items-center">
                  <p className="text-white text-xl">Your Reputation Points:&nbsp;</p>
                  <p className="text-white text-2xl font-bold">
                    {displayPoints}
                  </p>
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