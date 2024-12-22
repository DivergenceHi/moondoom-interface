import Image from 'next/image';
import { ConnectorButton } from '@/components/connector-button';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export const Header = () => {
  return (
    <header
      className="bg-background text-foreground"
      style={{
        backgroundImage: 'url(/header-bg.png)',
        backgroundSize: 'cover',
        backgroundRepeat: 'repeat',
      }}
    >
      <div className={'bg-black bg-opacity-30 py-8 font-chela'}>
        <div className="container mx-auto flex items-center">
          <Image src={'/logo.png'} alt={'logo'} width={119} height={49} />
          <button className={'bg-primary px-6 py-1 rounded-lg text-xl border-2 border-black ml-4'}>How it works</button>
          <div className="ml-auto flex">
            {/*<ConnectorButton />*/}
            <ConnectButton />
          </div>
        </div>
      </div>
    </header>
  );
};
