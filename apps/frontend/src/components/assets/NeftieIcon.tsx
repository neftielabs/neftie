import React from "react";

interface NeftieIconProps extends React.SVGProps<SVGSVGElement> {}

export const NeftieIcon: React.FC<NeftieIconProps> = ({ ...props }) => {
  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="40"
        viewBox="0 0 50 25"
        fill="currentColor"
        {...props}
      >
        <path d="M37.5,0c-2.3,0-4.45,.62-6.3,1.7h0c-1.82,1.04-3.94,1.64-6.19,1.64s-4.37-.6-6.19-1.64h0c-1.85-1.08-4-1.7-6.3-1.7C5.6,0,0,5.59,0,12.49H0c0,6.92,5.6,12.51,12.5,12.51,2.3,0,4.45-.62,6.3-1.7h0c1.82-1.04,3.94-1.64,6.19-1.64s4.37,.6,6.19,1.64h0c1.85,1.08,4,1.7,6.3,1.7,6.9,0,12.5-5.59,12.5-12.49h0c0-6.92-5.6-12.51-12.5-12.51Z" />
      </svg>
    </>
  );
};
