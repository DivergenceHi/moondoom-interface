import Image from 'next/image';
import { ConnectorButton } from '@/components/connector-button';
import HowItWorkDialog from '@/components/how-it-work-dialog';
import Link from 'next/link';

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
          <Link href={'/'}>
            <Image src={'/logo.png'} alt={'logo'} width={119} height={49} />
          </Link>
          <HowItWorkDialog />
          <div className="ml-auto flex">
            <ConnectorButton />
          </div>
        </div>
      </div>
    </header>
  );
};
