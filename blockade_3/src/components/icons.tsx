import type { FunctionComponent } from "react";
import type { LucideProps } from "lucide-react";

export type Icon = FunctionComponent<LucideProps & { className: string }>;

export const Logo: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    width="350"
    height="350"
    viewBox="0 0 350 350"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M70 0H0V350H350V280H70V0Z"
      fill="black"
    />
    <path
      d="M155 176.322L114.5 208.529C111.594 210.877 110 213.673 110 216.581C110 224.017 120.031 230 132.5 230H327.5C339.969 230 350 224.017 350 216.581C350 213.673 348.406 210.877 345.5 208.529L305 176.322H155Z"
      fill="#2563EB"
    />
    <path
      d="M231.861 164.221C218.566 164.221 206.776 162.14 196.492 157.977C186.265 153.762 178.197 147.96 172.288 140.571C166.378 133.182 163.367 124.675 163.253 115.048H205.697C205.867 118.535 207.089 121.631 209.361 124.337C211.634 126.99 214.731 129.072 218.651 130.581C222.572 132.09 227.032 132.844 232.032 132.844C237.032 132.844 241.435 132.038 245.242 130.425C249.106 128.759 252.117 126.496 254.276 123.634C256.435 120.72 257.486 117.39 257.43 113.643C257.486 109.897 256.322 106.567 253.935 103.653C251.549 100.739 248.168 98.4754 243.793 96.8623C239.475 95.2493 234.361 94.4427 228.452 94.4427H211.492V66.9685H228.452C233.623 66.9685 238.168 66.1879 242.089 64.6269C246.066 63.0659 249.163 60.8804 251.378 58.0706C253.594 55.2087 254.674 51.9305 254.617 48.236C254.674 44.6456 253.736 41.4976 251.805 38.7918C249.93 36.0339 247.288 33.9005 243.878 32.3915C240.526 30.8825 236.634 30.128 232.202 30.128C227.543 30.128 223.31 30.8825 219.503 32.3915C215.753 33.9005 212.77 36.0339 210.555 38.7918C208.339 41.5496 207.174 44.7497 207.06 48.3921H166.748C166.861 38.8698 169.759 30.4923 175.441 23.2594C181.123 15.9746 188.85 10.2768 198.623 6.1661C208.452 2.05537 219.645 0 232.202 0C244.702 0 255.697 2.00333 265.185 6.00999C274.674 10.0167 282.06 15.4803 287.344 22.4009C292.628 29.2694 295.27 37.0486 295.27 45.7384C295.327 54.7403 292.117 62.1553 285.64 67.9831C279.219 73.811 270.952 77.4014 260.839 78.7543V80.0031C274.361 81.4601 284.56 85.4668 291.435 92.0231C298.367 98.5795 301.805 106.775 301.748 116.609C301.748 125.872 298.765 134.093 292.799 141.274C286.89 148.403 278.651 154.022 268.083 158.133C257.572 162.192 245.498 164.221 231.861 164.221Z"
      fill="#2563EB"
    />
  </svg>
);
export const LogoSquare: Icon = (props) => (
  <svg
    width="512"
    height="512"
    viewBox="0 0 512 512"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g clip-path="url(#clip0_55_260)">
      <path
        d="M0 64C0 28.6538 28.6538 0 64 0H448C483.346 0 512 28.6538 512 64V448C512 483.346 483.346 512 448 512H64C28.6538 512 0 483.346 0 448V64Z"
        fill="#3B82F6"
      />
      <mask
        id="mask0_55_260"
        className="mask-type:luminance"
        maskUnits="userSpaceOnUse"
        x="56"
        y="56"
        width="400"
        height="400"
      >
        <path d="M456 56H56V456H456V56Z" fill="white" />
      </mask>
      <g mask="url(#mask0_55_260)">
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M445.23 67.6203C418.291 39.7137 347.04 63.7369 268.822 121.84C217.184 120.211 166.146 147.624 139.359 196.849C126.948 219.658 121.292 244.299 121.722 268.407L121.733 268.952C64.3804 346.201 40.1701 416.785 66.8089 444.38C102.539 481.392 216.215 427.056 320.713 323.017C425.21 218.978 480.958 104.633 445.23 67.6203ZM100.473 409.317C88.4295 396.84 101.542 362.042 131.669 318.276C141.985 344.346 160.071 367.342 184.829 383.391C143.948 410.264 111.97 421.228 100.473 409.317ZM408.487 102.655C419.943 114.521 408.64 146.583 381.582 187.346C369.371 167.44 352.017 150.427 330.154 138.52C326.169 136.351 322.126 134.401 318.039 132.663C361.816 102.843 396.424 90.1592 408.487 102.655Z"
          fill="#0F172A"
        />
        <path
          d="M401.965 271.702C400.497 292.289 394.551 312.947 383.732 332.214C357.644 378.649 309.925 405.091 260.952 405.603C286.405 387.72 312.31 366.497 337.548 342.398C361.794 319.248 383.414 295.357 401.965 271.702Z"
          fill="#0F172A"
        />
      </g>
    </g>
    <defs>
      <clipPath id="clip0_55_260">
        <rect width="512" height="512" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export const System: Icon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
    <path
      d="m11.998 2c5.517 0 9.997 4.48 9.997 9.998 0 5.517-4.48 9.997-9.997 9.997-5.518 0-9.998-4.48-9.998-9.997 0-5.518 4.48-9.998 9.998-9.998zm0 1.5c-4.69 0-8.498 3.808-8.498 8.498s3.808 8.497 8.498 8.497z"
      fillRule="nonzero"
      fill="currentColor"
    />
  </svg>
);
/* eslint-disable @typescript-eslint/restrict-template-expressions */
export const SparkleIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`lucide lucide-sparkle ${className}`}
  >
    <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
  </svg>
);

export const SuperSparkleIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`lucide lucide-sparkles ${className}`}
  >
    <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
    <path d="M20 3v4" />
    <path d="M22 5h-4" />
    <path d="M4 17v2" />
    <path d="M5 18H3" />
  </svg>
);

export const LightningIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`lucide lucide-zap ${className}`}
  >
    <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
  </svg>
);

export const UpArrowIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`lucide lucide-arrow-up ${className}`}
  >
    <path d="m5 12 7-7 7 7" />
    <path d="M12 19V5" />
  </svg>
);

export const CircleCheckIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`lucide lucide-circle-check ${className}`}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

export const EllipsisIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-ellipsis"
    {...props}
  >
    <circle cx="12" cy="12" r="1" />
    <circle cx="19" cy="12" r="1" />
    <circle cx="5" cy="12" r="1" />
  </svg>
);

export const PencilIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`lucide lucide-pencil ${className}`}
  >
    <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
    <path d="m15 5 4 4" />
  </svg>
);

export const TrashIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`lucide lucide-trash-2 ${className}`}
  >
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    <line x1="10" x2="10" y1="11" y2="17" />
    <line x1="14" x2="14" y1="11" y2="17" />
  </svg>
);
