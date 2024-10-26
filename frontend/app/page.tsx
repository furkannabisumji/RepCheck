"use client"

import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import config from '@/config.json';

const Home = () => {
  const { address, isConnected } = useAccount();
  const { writeContract, isPending } = useWriteContract();

  const { data: isRegistered } = useReadContract({
    abi: config.abi,
    address: `0x${config.address}`,
    functionName: 'isUserRegistered',
    args: [address],
  }) as { data: boolean | undefined };
 
  console.log({isRegistered});
  const { data: points } = useReadContract({
    abi: config.abi,
    address: `0x${config.address}`,
    functionName: 'getPoints',
    args: [address],
  }) as { data: bigint | undefined };

  // Convert bigint to string for display
  const displayPoints = points ? points.toString() : '0';

  return (
    <div className="min-h-screen bg-img flex text-white justify-center items-center">
      <div className="absolute top-0 left-0 p-4">
      <w3m-account-button />
        </div>
      <div className="text-center">
        {!isConnected ? (
          <w3m-connect-button />
        ) : (
          <div>
            {isRegistered ? (
              <div className="h-16 w-48 border border-pink-600 rounded-3xl flex justify-between p-4">
                <p className="text-gray-400 text-lg">Points</p>
                <p className="text-green-700 text-lg">{displayPoints}</p>
              </div>
            ) : (
              <div className="h-48 border border-pink-600 rounded-3xl flex flex-col gap-3 p-4 justify-center items-center">
              <p className="text-gray-400 text-5xl">You did not register 🥺
              </p>
              <button
                onClick={() => writeContract({
                  abi: config.abi,
                  address: `0x${config.address}`,
                  functionName: 'register',
                })}
                className="bg-white hover:bg-pink-600 text-black font-bold py-2 px-2 w-20 rounded disabled:opacity-50"
                disabled={isPending}
              >
                Register
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