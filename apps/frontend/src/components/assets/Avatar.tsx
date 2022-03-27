import { guard } from "fp-ts-std/Function";
import React, { useMemo } from "react";

interface AvatarProps extends React.SVGProps<SVGSVGElement> {
  avatarId: number;
}

export const Avatar: React.FC<AvatarProps> = ({ avatarId, ...props }) => {
  const avatars = useMemo(
    () => [
      <>
        <g clipPath="url(#clip0_8_3)">
          <rect
            width="305"
            height="305"
            rx="152.5"
            fill="url(#paint0_linear_8_3)"
          />
          <circle
            cx="337.5"
            cy="89.5"
            r="215.5"
            fill="white"
            style={{ mixBlendMode: "overlay" }}
          />
        </g>
        <defs>
          <linearGradient
            id="paint0_linear_8_3"
            x1="2.23583e-06"
            y1="-27"
            x2="338"
            y2="330"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#446BCE" />
            <stop offset="1" stopColor="#C752F0" />
          </linearGradient>
          <clipPath id="clip0_8_3">
            <rect width="305" height="305" rx="152.5" fill="white" />
          </clipPath>
        </defs>
      </>,
      <>
        <g clipPath="url(#clip0_8_16)">
          <rect
            width="305"
            height="305"
            rx="152.5"
            fill="url(#paint0_linear_8_16)"
          />
          <ellipse
            cx="151.975"
            cy="217.452"
            rx="121.956"
            ry="173.779"
            transform="rotate(50.4984 151.975 217.452)"
            fill="#E2B0AC"
            style={{ mixBlendMode: "overlay" }}
          />
        </g>
        <defs>
          <linearGradient
            id="paint0_linear_8_16"
            x1="152.5"
            y1="0"
            x2="152.5"
            y2="305"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#50F4FF" />
            <stop offset="1" stopColor="#356EFF" />
          </linearGradient>
          <clipPath id="clip0_8_16">
            <rect width="305" height="305" rx="152.5" fill="white" />
          </clipPath>
        </defs>
      </>,
      <>
        <g clipPath="url(#clip0_8_7)">
          <rect
            width="305"
            height="305"
            rx="152.5"
            fill="url(#paint0_linear_8_7)"
          />
          <circle
            cx="36.5"
            cy="-30.5"
            r="215.5"
            fill="white"
            fillOpacity="0.7"
            style={{ mixBlendMode: "overlay" }}
          />
        </g>
        <defs>
          <linearGradient
            id="paint0_linear_8_7"
            x1="152.5"
            y1="0"
            x2="152.5"
            y2="305"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#7EEB75" />
            <stop offset="1" stopColor="#EBE675" />
          </linearGradient>
          <clipPath id="clip0_8_7">
            <rect width="305" height="305" rx="152.5" fill="white" />
          </clipPath>
        </defs>
      </>,
      <>
        <g clipPath="url(#clip0_8_13)">
          <rect
            width="305"
            height="305"
            rx="152.5"
            fill="url(#paint0_linear_8_13)"
          />
          <circle
            cx="367.5"
            cy="-0.5"
            r="215.5"
            fill="white"
            fillOpacity="0.7"
            style={{ mixBlendMode: "overlay" }}
          />
          <circle
            cx="7.5"
            cy="89.5"
            r="215.5"
            fill="white"
            fillOpacity="0.7"
            style={{ mixBlendMode: "overlay" }}
          />
        </g>
        <defs>
          <linearGradient
            id="paint0_linear_8_13"
            x1="152.5"
            y1="0"
            x2="152.5"
            y2="305"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#EB75DF" />
            <stop offset="1" stopColor="#EB5A5A" />
          </linearGradient>
          <clipPath id="clip0_8_13">
            <rect width="305" height="305" rx="152.5" fill="white" />
          </clipPath>
        </defs>
      </>,
      <>
        <g clipPath="url(#clip0_8_9)">
          <rect
            width="305"
            height="305"
            rx="152.5"
            fill="url(#paint0_linear_8_9)"
          />
          <ellipse
            cx="152.5"
            cy="21.5"
            rx="152.5"
            ry="215.5"
            fill="#E2B0AC"
            style={{ mixBlendMode: "overlay" }}
          />
        </g>
        <defs>
          <linearGradient
            id="paint0_linear_8_9"
            x1="152.5"
            y1="0"
            x2="152.5"
            y2="305"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#FF5050" />
            <stop offset="1" stopColor="#FFC635" />
          </linearGradient>
          <clipPath id="clip0_8_9">
            <rect width="305" height="305" rx="152.5" fill="white" />
          </clipPath>
        </defs>
      </>,
    ],
    []
  );

  return (
    <svg
      width="35"
      viewBox="0 0 305 305"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {guard<number, React.ReactElement>([[(n) => n < 5, (n) => avatars[n]]])(
        () => avatars[0]
      )(avatarId)}
    </svg>
  );
};
