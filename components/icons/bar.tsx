import { forwardRef } from 'react';
import { IconProps } from '@/types/icon';

export const BarIcon = forwardRef<SVGSVGElement, IconProps>(({ color = 'currentColor', ...props }, forwardedRef) => {
  return (
    <svg
      width="204"
      height="10"
      viewBox="0 0 204 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      ref={forwardedRef}
      {...props}
      color={color}
    >
      <rect x="1.45459" y="1.09033" width="201.789" height="7.60241" rx="3.8012" fill="#464646" stroke="black" />
    </svg>
  );
});

BarIcon.displayName = 'BarIcon';
