import { forwardRef } from 'react';
import { IconProps } from '@/types/icon';

export const DownIcon = forwardRef<SVGSVGElement, IconProps>(({ color = 'currentColor', ...props }, forwardedRef) => {
  return (
    <svg
      width="22"
      height="18"
      viewBox="0 0 22 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      ref={forwardedRef}
      {...props}
      color={color}
    >
      <line
        y1="-1.5"
        x2="9.13494"
        y2="-1.5"
        transform="matrix(-0.672705 -0.73991 -0.73997 0.67264 19.0227 17.8795)"
        stroke="#D02626"
        strokeWidth="3"
      />
      <line
        y1="-1.5"
        x2="15.0013"
        y2="-1.5"
        transform="matrix(-0.573497 -0.819208 -0.819256 0.573428 9.19043 14.8073)"
        stroke="#D02626"
        strokeWidth="3"
      />
      <line
        y1="-1.5"
        x2="7.16622"
        y2="-1.5"
        transform="matrix(-0.857513 0.514462 0.514529 0.857473 15.3357 11.1205)"
        stroke="#D02626"
        strokeWidth="3"
      />
    </svg>
  );
});

DownIcon.displayName = 'DownIcon';
