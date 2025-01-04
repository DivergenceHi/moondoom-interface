'use client';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Image from 'next/image';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { useDisconnect } from 'wagmi';
import Link from 'next/link';

export const ConnectorButton = () => {
  const { disconnect } = useDisconnect();
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
                  <button
                    onClick={openChainModal}
                    type="button"
                    className={'bg-white px-2 py-2 rounded-lg border-2 border-black font-roboto'}
                  >
                    Wrong network
                  </button>
                );
              }
              return (
                <div className={'flex'}>
                  <button
                    onClick={openChainModal}
                    className={
                      'bg-primary px-4 py-1 rounded-l-lg text-xl border-2 border-black flex items-center gap-3'
                    }
                  >
                    {chain.iconUrl && (
                      <Image alt={chain.name ?? 'Chain icon'} src={chain.iconUrl} width={30} height={30} />
                    )}
                    {chain.name}
                  </button>
                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger asChild>
                      <button
                        onClick={openAccountModal}
                        type="button"
                        className={
                          'flex items-center gap-1 bg-white px-2 py-2 rounded-r-lg border-2 border-black font-roboto -ml-1'
                        }
                      >
                        <Image src={'/avatar.png'} alt={'avatar'} width={36} height={36} />
                        {account.displayName}
                      </button>
                    </DropdownMenu.Trigger>

                    <DropdownMenu.Portal>
                      <DropdownMenu.Content
                        className={
                          'DropdownMenuContent border-2 border-black rounded-b-lg w-[130px] font-chela bg-primary'
                        }
                        align={'end'}
                        side={'bottom'}
                        sideOffset={0}
                      >
                        <DropdownMenu.Item className={'DropdownMenuItem'}>
                          <Link href={'/portfolio'}>Portfolio</Link>
                        </DropdownMenu.Item>
                        <DropdownMenu.Item className={'DropdownMenuItem'} onClick={() => disconnect?.()}>
                          Log Out
                        </DropdownMenu.Item>
                      </DropdownMenu.Content>
                    </DropdownMenu.Portal>
                  </DropdownMenu.Root>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};
