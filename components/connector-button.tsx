'use client';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Image from 'next/image';
import { EthIcon } from '@/components/icons/eth';

export const ConnectorButton = () => {
  return (
    <ConnectButton.Custom>
      {({ account, chain, openAccountModal, openChainModal, openConnectModal, authenticationStatus, mounted }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted && authenticationStatus !== 'loading';
        const connected =
          ready && account && chain && (!authenticationStatus || authenticationStatus === 'authenticated');
        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              style: {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button onClick={openConnectModal} type="button">
                    Connect Wallet
                  </button>
                );
              }
              if (chain.unsupported) {
                return (
                  <button onClick={openChainModal} type="button">
                    Wrong network
                  </button>
                );
              }
              return (
                <div style={{ display: 'flex', gap: 12 }}>
                  <button
                    onClick={openChainModal}
                    className={
                      'bg-primary px-4 py-1 rounded-l-lg text-xl border-2 border-black flex items-center gap-3'
                    }
                  >
                    {/*{chain.iconUrl && (*/}
                    {/*  <Image alt={chain.name ?? 'Chain icon'} src={chain.iconUrl} width={30} height={30} />*/}
                    {/*)}*/}
                    {chain.name}
                  </button>
                  <button onClick={openAccountModal} type="button" className={'flex items-center gap-1'}>
                    <Image src={'/avatar.png'} alt={'avatar'} width={36} height={36} />
                    {account.displayName}
                  </button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};
