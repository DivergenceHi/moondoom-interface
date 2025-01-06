import { forwardRef } from 'react';
import { SelectItemProps } from '@/app/page';
import * as Select from '@radix-ui/react-select';
import clsx from 'clsx';
import { CheckIcon } from '@radix-ui/react-icons';

export const SelectItem = forwardRef<HTMLDivElement, SelectItemProps>(
  ({ children, className, value, ...props }, forwardedRef) => {
    return (
      <Select.Item className={clsx('SelectItem', className)} {...props} ref={forwardedRef} value={value}>
        <Select.ItemText>{children}</Select.ItemText>
        <Select.ItemIndicator className="SelectItemIndicator">
          <CheckIcon />
        </Select.ItemIndicator>
      </Select.Item>
    );
  },
);

SelectItem.displayName = 'SelectItem';
