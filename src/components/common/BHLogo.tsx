import React from "react";

interface BHLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
}

export const BHLogo: React.FC<BHLogoProps> = ({ size = "md", showText = true }) => {
  const dimensions = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-24 h-24",
  }[size];

  const textSize = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-3xl",
    xl: "text-5xl",
  }[size];

  return (
    <div className="flex items-center gap-3 select-none group">
      {/* Golden Badge Logo Container */}
      <div className={`relative ${dimensions} flex items-center justify-center`}>
        {/* Outer Glowing Ring */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#B38728] via-[#FDF0A6] to-[#AA771C] p-[2px] shadow-gold-md group-hover:shadow-gold-lg transition-all duration-300">
          <div className="w-full h-full bg-white rounded-full flex items-center justify-center p-1 relative overflow-hidden">
            {/* Inner Metallic Shimmer */}
            <div className="absolute inset-0 bg-gold-radial opacity-40 group-hover:opacity-70 transition-opacity" />

            {/* Custom SVG Icon - Inspired by the logo badge */}
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full text-[#D4AF37] relative z-10 drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)]"
              fill="currentColor"
            >
              <defs>
                <linearGradient id="bhGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFE89C" />
                  <stop offset="30%" stopColor="#D4AF37" />
                  <stop offset="70%" stopColor="#AA771C" />
                  <stop offset="100%" stopColor="#F5E08B" />
                </linearGradient>
              </defs>

              {/* Upper Figure Arcs */}
              <circle cx="36" cy="22" r="5.5" fill="url(#bhGoldGrad)" />
              <circle cx="64" cy="22" r="5.5" fill="url(#bhGoldGrad)" />
              <path
                d="M 32 30 C 40 24, 60 24, 68 30 C 72 38, 62 46, 50 46 C 38 46, 28 38, 32 30 Z"
                fill="url(#bhGoldGrad)"
              />

              {/* Bold BH Letterforms */}
              <text
                x="50%"
                y="76%"
                textAnchor="middle"
                fontSize="38"
                fontWeight="900"
                fontFamily="Impact, sans-serif"
                fill="url(#bhGoldGrad)"
                letterSpacing="-1"
              >
                BH
              </text>
            </svg>
          </div>
        </div>
      </div>

      {/* Brand Text Header */}
      {showText && (
        <div className="flex flex-col leading-none">
          <div className={`font-extrabold tracking-wider text-gold-gradient ${textSize} font-serif`}>
            BH <span className="text-slate-900 font-sans font-black">REELS</span>
          </div>
          <span className="text-[10px] tracking-[0.25em] text-[#B8860B] uppercase font-semibold mt-0.5">
            INFLUENCER NETWORK
          </span>
        </div>
      )}
    </div>
  );
};
