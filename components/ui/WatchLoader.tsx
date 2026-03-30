"use client"

const CX = 89.7
const CY = 95.48

export function WatchLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#020208]">
      <style>{`
        .watch-hour {
          transform-origin: ${CX}px ${CY}px;
          animation: watchSpin 8s linear infinite;
        }
        .watch-minute {
          transform-origin: ${CX}px ${CY}px;
          animation: watchSpin 2s linear infinite;
        }
        @keyframes watchSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>

      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="180"
        height="185"
        viewBox="0 0 180 185"
        fill="none"
      >
        <defs>
          <filter
            id="f0"
            x="47.2266"
            y="58.9193"
            width="86.6667"
            height="86.6665"
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
            <feOffset dy="6.77083" />
            <feGaussianBlur stdDeviation="6.85547" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.18 0"
            />
            <feBlend
              mode="normal"
              in2="BackgroundImageFix"
              result="effect1_dropShadow"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow"
              result="shape"
            />
          </filter>
          <filter
            id="f1"
            x="85.5782"
            y="-0.000162601"
            width="8.46346"
            height="98.1771"
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
            <feOffset />
            <feGaussianBlur stdDeviation="1.69271" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.55 0"
            />
            <feBlend
              mode="normal"
              in2="BackgroundImageFix"
              result="effect1_dropShadow"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow"
              result="shape"
            />
          </filter>
          <filter
            id="f2"
            x="86.3282"
            y="76.8328"
            width="62.5809"
            height="22.4842"
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
            <feOffset />
            <feGaussianBlur stdDeviation="1.69271" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0"
            />
            <feBlend
              mode="normal"
              in2="BackgroundImageFix"
              result="effect1_dropShadow"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow"
              result="shape"
            />
          </filter>
          <filter
            id="f3"
            x="78.8621"
            y="84.6484"
            width="21.6667"
            height="21.6665"
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
            <feOffset />
            <feGaussianBlur stdDeviation="3.30078" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.3 0"
            />
            <feBlend
              mode="normal"
              in2="BackgroundImageFix"
              result="effect1_dropShadow"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow"
              result="shape"
            />
          </filter>
        </defs>

        {/* Dark center circle */}
        <g filter="url(#f0)">
          <circle cx="90.5599" cy="95.4818" r="29.6224" fill="#191919" />
        </g>

        {/* Dashed outer ring */}
        <circle
          cx="89.7136"
          cy="94.6353"
          r="85.4818"
          stroke="#262626"
          strokeWidth="8.46354"
          strokeDasharray="1.69 20.31"
        />

        {/* Hour hand */}
        <g className="watch-hour" filter="url(#f1)">
          <path
            d="M89.81 3.38525L90.6563 94.7915H88.9636L89.81 3.38525Z"
            fill="white"
          />
        </g>

        {/* Minute hand */}
        <g className="watch-minute" filter="url(#f2)">
          <path
            d="M145.524 80.2184L90.1518 95.9315L89.7136 94.2965L145.524 80.2184Z"
            fill="white"
          />
        </g>

        {/* Center dot */}
        <g filter="url(#f3)">
          <circle cx="89.6954" cy="95.4818" r="4.23177" fill="white" />
        </g>
      </svg>
    </div>
  )
}
