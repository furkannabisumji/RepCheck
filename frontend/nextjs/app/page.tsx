"use client"

import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import config  from '@/config.json';
const Home = () => {
  const { address, isConnected } = useAccount();
  const { writeContract, isPending } = useWriteContract();


  const { data: isRegistered } =useReadContract({
    abi: config.abi,
    address: `0x${config.address}`,
    functionName: 'isUserRegistered',
    args: [address],
  });

  const { data: points} = useReadContract({
    abi: config.abi,
    address: `0x${config.address}`,
    functionName: 'getPoints',
    args: [address],
  });

  return (
    <div className="min-h-screen bg-black flex text-white justify-center items-center">
      <div className="text-center">
        {!isConnected ? (
      <w3m-connect-button/>
        ) : (
          <div>
            <p className="mb-4"><w3m-account-button/></p>
            {isRegistered ? (
              <div className="h-16 w48 border border-pink-600 rounded-3xl flex justify-between p-4">
                <p className="text-gray-400 text-lg">Points</p>
                <p className="text-green-700 text-lg">{points}</p>
                </div>
            ) : (
              <button
                onClick={() => writeContract(
                  {
                    abi: config.abi,
                    address: `0x${config.address}`,
                    functionName: 'register',
                  }
                )}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded disabled:opacity-5"
                disabled={isPending}
              >
                Register
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
