import React from "react";

interface EthIconProps extends React.SVGAttributes<SVGSVGElement> {}

export const EthIcon: React.FC<EthIconProps> = (props) => {
  return (
    <svg
      width="12"
      viewBox="0 0 256 417"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M127.961 0L125.166 9.5V285.168L127.961 287.958L255.923 212.32L127.961 0Z"
        fill="#343434"
      />
      <path d="M127.962 0L0 212.32L127.962 287.959V154.158V0Z" fill="#8C8C8C" />
      <path
        d="M127.961 312.187L126.386 314.107V412.306L127.961 416.907L255.999 236.587L127.961 312.187Z"
        fill="#3C3C3B"
      />
      <path
        d="M127.962 416.905V312.185L0 236.585L127.962 416.905Z"
        fill="#8C8C8C"
      />
      <path
        d="M127.961 287.958L255.921 212.321L127.961 154.159V287.958Z"
        fill="#141414"
      />
      <path
        d="M0.000854492 212.321L127.961 287.958V154.159L0.000854492 212.321Z"
        fill="#393939"
      />
    </svg>
  );
};
