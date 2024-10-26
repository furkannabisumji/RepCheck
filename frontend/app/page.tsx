"use client";

import { useAccount, useReadContract, useWriteContract } from "wagmi";
import config from "@/config.json";

const Home = () => {
  const { address, isConnected } = useAccount();
  const { writeContract, isPending } = useWriteContract();

  const { data: isRegistered } = useReadContract({
    abi: config.abi,
    address: `0x${config.address}`,
    functionName: "isUserRegistered",
    args: [address],
  }) as { data: boolean | undefined };

  const { data: points } = useReadContract({
    abi: config.abi,
    address: `0x${config.address}`,
    functionName: "getPoints",
    args: [address],
  }) as { data: bigint | undefined };

  const displayPoints = points ? points.toString() : "0";

  return (
    <div className="min-h-screen bg-img flex flex-col justify-center items-center text-white relative">
      {/* Top Account Button */}
      <div className="absolute top-4 left-4">
        <w3m-account-button />
      </div>

      {/* Logo */}
      <div className="absolute top-4 flex justify-center w-full">
        <img
          src="LogoRepCheck.png"
          alt="Logo"
          className="h-64 w-auto object-contain"
        />
      </div>

      {/* Main Content */}
      <div className="text-center space-y-8 mt-16">
        {!isConnected ? (
          <div className="flex flex-col items-center">
            <w3m-connect-button />
            <p className="mt-4 text-lg text-gray-400">Please connect your wallet to continue</p>
          </div>
        ) : (
          <div className="w-full max-w-sm">
            {isRegistered ? (
              <div className="border border-pink-600 rounded-xl p-6 bg-gray-900 shadow-lg">
                <div className="flex justify-between items-center">
                  <p className="text-gray-400 text-xl">Points</p>
                  <p className="text-green-500 text-2xl font-bold">{displayPoints}</p>
                </div>
              </div>
            ) : (
              <div className="border border-pink-600 rounded-xl p-8 bg-gray-900 shadow-lg space-y-6">
                <p className="text-gray-400 text-2xl">You are not registered 🥺</p>
                <button
                  onClick={() =>
                    writeContract({
                      abi: config.abi,
                      address: `0x${config.address}`,
                      functionName: "register",
                    })
                  }
                  className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded w-full"
                  disabled={isPending}
                >
                  {isPending ? "Registering..." : "Register"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
