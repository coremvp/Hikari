import { Building2, Folder, UserRound } from 'lucide-react';

export function BuildingBeyondHikariFigure({
  backgroundSrc = '/blog/building-beyond-hikari-background.webp',
  logoSrc = '/blog/coremvp.svg',
}: {
  backgroundSrc?: string;
  logoSrc?: string;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 1200 630"
      width="1200"
      height="630"
      role="img"
      aria-labelledby="shared-work-title shared-work-description"
      className="block h-full w-full"
      preserveAspectRatio="xMidYMid slice"
      fontFamily="Arial, Helvetica, sans-serif"
    >
      <title id="shared-work-title">CoreMVP shared workspace ownership</title>
      <desc id="shared-work-description">
        An Organization groups members and owns Projects. Current membership and
        roles determine access to those Projects.
      </desc>
      <defs>
        <pattern
          id="shared-work-dots"
          width="24"
          height="24"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="2" cy="2" r="1.2" fill="white" fillOpacity="0.48" />
        </pattern>
        <radialGradient
          id="shared-work-cluster-a"
          gradientUnits="userSpaceOnUse"
          cx="820"
          cy="55"
          r="440"
        >
          <stop stopColor="white" stopOpacity="0.6" />
          <stop offset="0.48" stopColor="white" stopOpacity="0.24" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </radialGradient>
        <radialGradient
          id="shared-work-cluster-b"
          gradientUnits="userSpaceOnUse"
          cx="380"
          cy="580"
          r="400"
        >
          <stop stopColor="white" stopOpacity="0.6" />
          <stop offset="0.48" stopColor="white" stopOpacity="0.24" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </radialGradient>
        <mask id="shared-work-pattern-mask">
          <rect width="1200" height="630" fill="url(#shared-work-cluster-a)" />
          <rect width="1200" height="630" fill="url(#shared-work-cluster-b)" />
          <rect x="326" y="168" width="548" height="366" rx="22" fill="black" />
        </mask>
      </defs>
      <image
        href={backgroundSrc}
        width="1200"
        height="630"
        preserveAspectRatio="xMidYMid slice"
      />
      <rect width="1200" height="630" fill="#160f27" fillOpacity="0.24" />
      <rect
        width="1200"
        height="630"
        fill="url(#shared-work-dots)"
        mask="url(#shared-work-pattern-mask)"
      />

      <image href={logoSrc} x="490" y="63" width="52" height="52" />
      <text x="557" y="102" fill="white" fontSize="42" letterSpacing="-1.6">
        coremvp
      </text>

      <rect
        x="330"
        y="172"
        width="540"
        height="358"
        rx="18"
        fill="white"
        fillOpacity="0.12"
        stroke="white"
        strokeOpacity="0.7"
        strokeWidth="2"
      />
      <g transform="translate(370 205)">
        <Building2 width="30" height="30" color="white" strokeWidth="1.7" />
      </g>
      <text x="416" y="231" fill="white" fontSize="30" fontWeight="500">
        Organization
      </text>
      <path
        d="M364 255H836"
        fill="none"
        stroke="white"
        strokeOpacity="0.24"
        strokeWidth="1.5"
      />

      <g
        fill="none"
        stroke="white"
        strokeOpacity="0.65"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M454 353V370H746V353M600 353V415M454 415V391H746V415" />
      </g>
      {[454, 600, 746].map((x) => (
        <g key={x}>
          <circle
            cx={x}
            cy="326"
            r="27"
            fill="white"
            fillOpacity="0.2"
            stroke="white"
            strokeOpacity="0.8"
            strokeWidth="1.5"
          />
          <g transform={`translate(${x - 15} 311)`}>
            <UserRound width="30" height="30" color="white" strokeWidth="1.7" />
          </g>
          <rect
            x={x - 34}
            y="415"
            width="68"
            height="58"
            rx="10"
            fill="white"
            fillOpacity="0.2"
            stroke="white"
            strokeOpacity="0.8"
            strokeWidth="1.5"
          />
          <g transform={`translate(${x - 17} 427)`}>
            <Folder width="34" height="34" color="white" strokeWidth="1.7" />
          </g>
        </g>
      ))}
      <text x="600" y="497" textAnchor="middle" fill="white" fontSize="22">
        Projects
      </text>
      <text x="600" y="286" textAnchor="middle" fill="white" fontSize="22">
        Members
      </text>
      <text
        x="600"
        y="575"
        textAnchor="middle"
        fill="white"
        fontSize="30"
        letterSpacing="-0.6"
      >
        Shared work. Clear ownership.
      </text>
    </svg>
  );
}
