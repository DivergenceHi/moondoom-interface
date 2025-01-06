import * as Select from '@radix-ui/react-select';
import { MagnifyingGlassIcon, TriangleDownIcon } from '@radix-ui/react-icons';
import Image from 'next/image';
import { SelectItem } from '@/components/select';
import { useState } from 'react';

const underlyings = ['BTC', 'ETH/BTC', 'SOL/ETH'];

export const UnderlyingSelector = ({
  underlying,
  setUnderlying,
}: {
  underlying: string;
  setUnderlying: (underlying: string) => void;
}) => {
  const [search, setSearch] = useState('');
  const filterUnderlyings = !!search
    ? underlyings.filter((u) => u.toLowerCase().includes(search.toLowerCase()))
    : underlyings;

  return (
    <Select.Root defaultValue={'BTC'} onValueChange={(v) => setUnderlying(v)}>
      <Select.Trigger className="SelectTrigger" defaultValue={'BTC'} value={underlying} asChild>
        <div className={'flex items-center gap-2'}>
          <Select.Value placeholder="" />
          <TriangleDownIcon width={20} height={20} className={'ml-auto'} />
        </div>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content className="SelectContent w-[200px]" sideOffset={10} side={'bottom'} position={'popper'}>
          <Select.Viewport className="SelectViewport">
            <div className={'font-semibold'}>Select a token</div>
            <div className={'input-md-wrapper bg-white !px-2 font-chela !py-1 mb-1'}>
              <MagnifyingGlassIcon width={24} height={24} className={'text-foreground'} />
              <input
                type="text"
                placeholder={'Search Coins'}
                className={'ml-2'}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            {filterUnderlyings.map((u) => (
              <SelectItem value={u} key={u}>
                <div className="flex items-center gap-2">
                  <Image src={'/hp.png'} alt={'hp'} width={24} height={24} />
                  {u}
                </div>
              </SelectItem>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
};
