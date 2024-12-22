'use client';

import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { base } from 'viem/chains';

export const queryClient = new QueryClient();

const config = getDefaultConfig({
  appName: 'MoonDoom',
  projectId: '883aff82a04d42ede368617737bbf380',
  chains: [base],
  ssr: true,
});

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
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
