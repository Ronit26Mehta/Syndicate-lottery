import '../styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultWallets, RainbowKitProvider, connectorsForWallets, Chain } from '@rainbow-me/rainbowkit';
import type { AppProps } from 'next/app';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';

import {
  arbitrum,
  goerli,
  mainnet,
  optimism,
  polygon,
  base,
  zora,
  avalancheFuji,
} from 'wagmi/chains';
import Nav from '@/components/nav';
import { publicProvider } from 'wagmi/providers/public';

const projectId = "bbc302f89a722c69f043215565e5bf08";
const wanTest: Chain = {
  id: 999,
  name: 'Wanchain Testnet',
  network: 'Wanchain Testnet',
  iconUrl: '/wanchainlogo.png',
  iconBackground: '#fff',
  nativeCurrency: {
    decimals: 18,
    name: 'WAN',
    symbol: 'WAN',
  },
  rpcUrls: {
    public: { http: ['https://gwan-ssl.wandevs.org:46891'] },
    default: { http: ['https://gwan-ssl.wandevs.org:46891'] },
  },
  blockExplorers: {
    default: { name: 'WanScan', url: 'https://testnet.wanscan.org/' },
    etherscan: { name: 'WanScan', url: 'https://testnet.wanscan.org/' },
  },
  testnet: true,
};

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [
    wanTest,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true' ? [goerli, avalancheFuji] : []),
  ],
  [publicProvider()]
);

const { wallets } = getDefaultWallets({
  appName: "RainbowKit demo",
  projectId,
  chains,
});

const connectors = connectorsForWallets([
  ...wallets,
  {
    groupName: "Okto",
    wallets: [],
  },
]);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        <Nav />
        <Component {...pageProps} />
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
