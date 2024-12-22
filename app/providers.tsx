'use client';

import '@rainbow-me/rainbowkit/styles.css';
import { connectorsForWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { createConfig, createStorage, http, WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { base } from 'viem/chains';
import { metaMaskWallet, rainbowWallet, walletConnectWallet } from '@rainbow-me/rainbowkit/wallets';

export const queryClient = new QueryClient();

const connectors = connectorsForWallets(
  [
    {
      groupName: 'Recommended',
      wallets: [metaMaskWallet, rainbowWallet, walletConnectWallet],
    },
  ],
  {
    appName: 'MoonDoom',
    projectId: '883aff82a04d42ede368617737bbf380',
  },
);

export const config = createConfig({
  connectors,
  chains: [base],
  storage: createStorage({ storage: typeof window !== 'undefined' ? window.localStorage : undefined }),
  transports: {
    [base.id]: http(),
  },
});

export const Providers = ({ children }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <Toaster position={'top-center'} duration={3000} />
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
