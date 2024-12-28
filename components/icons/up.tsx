import { forwardRef } from 'react';
import { IconProps } from '@/types/icon';

export const UpIcon = forwardRef<SVGSVGElement, IconProps>(({ color = 'currentColor', ...props }, forwardedRef) => {
  return (
    <svg
      width="21"
      height="18"
      viewBox="0 0 21 18"
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
        transform="matrix(0.672705 -0.73991 0.73997 0.67264 2.29028 17.2651)"
        stroke="#07A085"
        stroke-width="3"
      />
      <line
        y1="-1.5"
        x2="15.0013"
        y2="-1.5"
        transform="matrix(0.573497 -0.819208 0.819256 0.573428 12.1226 14.1928)"
        stroke="#07A085"
        stroke-width="3"
      />
      <line
        y1="-1.5"
        x2="7.16622"
        y2="-1.5"
        transform="matrix(0.857513 0.514462 -0.514529 0.857473 5.97729 10.506)"
        stroke="#07A085"
        stroke-width="3"
      />
    </svg>
  );
});

UpIcon.displayName = 'UpIcon';
