import * as Select from '@radix-ui/react-select';
import { MagnifyingGlassIcon, TriangleDownIcon } from '@radix-ui/react-icons';
import { SelectItem } from '@/components/select';
import { USDCIcon } from 'web3-icons';

export const CollateralSelector = ({
  collateral,
  setCollateral,
}: {
  collateral: string;
  setCollateral: (collateral: string) => void;
}) => {
  return (
    <Select.Root defaultValue={'USDC'} onValueChange={(value) => setCollateral(value)} value={collateral}>
      <Select.Trigger className="SelectTrigger" defaultValue={'USDC'} asChild>
        <div className={'flex items-center gap-2'}>
          <Select.Value placeholder="" />
          <TriangleDownIcon width={20} height={20} className={'ml-auto'} />
        </div>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content
          className="SelectContent w-[200px] z-10 relative"
          side={'bottom'}
          sideOffset={10}
          align={'end'}
          position={'popper'}
        >
          <Select.Viewport className="SelectViewport z-10">
            <div className={'font-semibold'}>Select a token</div>
            <div className={'input-md-wrapper bg-white !px-2 font-chela !py-1 mb-1'}>
              <MagnifyingGlassIcon width={24} height={24} className={'text-foreground'} />
              <input type="text" placeholder={'Search Coins'} className={'ml-2'} />
            </div>
            <SelectItem value="USDC">
              <div className="flex items-center gap-2">
                <USDCIcon width={20} height={20} />
                USDC
              </div>
            </SelectItem>
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
};
