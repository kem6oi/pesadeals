import React from 'react';

export default function Logo({ size = 36, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="pdGradient" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#00A859" />
          <stop offset="100%" stopColor="#007038" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="11" fill="url(#pdGradient)" />
      {/* Subtle Kenyan shield / coin ring */}
      <circle cx="20" cy="20" r="13.5" stroke="white" strokeOpacity="0.2" strokeWidth="1.5" />
      {/* Stylized upward growth arrow / P monogram */}
      <path
        d="M14 27V13.5C14 12.6716 14.6716 12 15.5 12H21.5C24.8137 12 27.5 14.4624 27.5 17.5C27.5 20.5376 24.8137 23 21.5 23H17.5V27H14Z"
        fill="white"
      />
      <path
        d="M17.5 15.2V19.8H21.2C22.7464 19.8 24 18.7703 24 17.5C24 16.2297 22.7464 15.2 21.2 15.2H17.5Z"
        fill="#008744"
      />
      {/* Upward spark accent */}
      <path
        d="M27.5 11.5L29 9M30.5 14.5L33 13.5"
        stroke="#FDE047"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
