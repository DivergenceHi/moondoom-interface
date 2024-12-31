import { forwardRef } from 'react';
import { IconProps } from '@/types/icon';

export const ArrowFillIcon = forwardRef<SVGSVGElement, IconProps>(
  ({ color = 'currentColor', ...props }, forwardedRef) => {
    return (
      <svg
        width="25"
        height="29"
        viewBox="0 0 25 29"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        ref={forwardedRef}
        {...props}
        color={color}
      >
        <path d="M12.741 0.985596L23.005 16.8068H2.47701L12.741 0.985596Z" fill={color} />
        <rect x="9.18506" y="8.43079" width="7.11111" height="19.8541" fill={color} />
      </svg>
    );
  },
);

ArrowFillIcon.displayName = 'ArrowFillIcon';
