import { cookieStorage, createStorage, http } from '@wagmi/core'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { mainnet, arbitrum, baseSepolia, sepolia, defineChain } from '@reown/appkit/networks'

// Get projectId from https://cloud.reown.com
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID

if (!projectId) {
  throw new Error('Project ID is not defined')
}

// Define the custom network
const repChain = defineChain({
  id: 50078,
  caipNetworkId: 'eip155:50078',
  chainNamespace: 'eip155',
  name: 'RepChain',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.reponchain.com/'],
      webSocket: [],
    },
  },
  blockExplorers: {
    default: { name: 'Explorer', url: 'https://explorer.reponchain.com' },
  },
  contracts: {
    // Add the contracts here
  }
})

export const networks = [repChain, sepolia];

//Set up the Wagmi Adapter (Config)
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage
  }),
  ssr: true,
  projectId,
  networks
})

export const config = wagmiAdapter.wagmiConfig