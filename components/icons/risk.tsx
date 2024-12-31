import { forwardRef } from 'react';
import { IconProps } from '@/types/icon';

export const RiskIcon = forwardRef<SVGSVGElement, IconProps>(({ color = 'currentColor', ...props }, forwardedRef) => {
  return (
    <svg
      width="17"
      height="18"
      viewBox="0 0 17 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      ref={forwardedRef}
      {...props}
      color={color}
    >
      <g filter="url(#filter0_di_1199_2567)">
        <path
          d="M4 2.35971L5.81652 1.00109L7.22019 0.418146L8.54135 5.63887e-07L10.1101 0.418146L11.4312 1.00109L13 2.35971L10.4404 8.58077L8.54135 10L6.72477 8.58077L4 2.35971Z"
          fill="url(#paint0_linear_1199_2567)"
        />
      </g>
      <defs>
        <filter
          id="filter0_di_1199_2567"
          x="0"
          y="0"
          width="17"
          height="18"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="4" />
          <feGaussianBlur stdDeviation="2" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1199_2567" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1199_2567" result="shape" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="3" />
          <feGaussianBlur stdDeviation="1.5" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0" />
          <feBlend mode="normal" in2="shape" result="effect2_innerShadow_1199_2567" />
        </filter>
        <linearGradient
          id="paint0_linear_1199_2567"
          x1="3.58716"
          y1="2.64574"
          x2="13.4952"
          y2="2.74108"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.485" stop-color="#FF0000" />
          <stop offset="0.4851" stop-color="#D3D3D3" />
        </linearGradient>
      </defs>
    </svg>
  );
});

RiskIcon.displayName = 'RiskIcon';
