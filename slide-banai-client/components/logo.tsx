import React from "react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  withText?: boolean;
}

export function Logo({ size = "md", withText = true }: LogoProps) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  const textSizeClasses = {
    sm: "text-base",
    md: "text-lg",
    lg: "text-xl",
  };

  return (
    <div className="flex items-center">
      <div
        className={`${sizeClasses[size]} bg-primary-600 rounded-md flex items-center justify-center text-white font-bold`}
      >
        SC
      </div>
      {withText && (
        <span className={`ml-2 ${textSizeClasses[size]} font-semibold`}>
          SlideBanai
        </span>
      )}
    </div>
  );
}

export default Logo;
