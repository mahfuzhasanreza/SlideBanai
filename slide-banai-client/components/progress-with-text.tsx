import { cn } from "@/lib/utils";

interface ProgressWithTextProps {
  label: string;
  value: number;
  max?: number;
  className?: string;
  size?: "sm" | "md" | "lg";
  color?: "primary" | "warning" | "success" | "error";
}

export default function ProgressWithText({
  label,
  value,
  max = 100,
  className,
  size = "md",
  color = "primary",
}: ProgressWithTextProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  const getColor = () => {
    if (color === "primary") return "bg-primary-500";
    if (color === "warning") return "bg-warning-500";
    if (color === "success") return "bg-success-500";
    if (color === "error") return "bg-error-500";
    return "bg-primary-500";
  };

  // Automatically determine color based on value if not specified
  const determineColor = () => {
    if (color !== "primary") return getColor();
    if (percentage < 30) return "bg-error-500";
    if (percentage < 70) return "bg-warning-500";
    return "bg-success-500";
  };

  const heightClass = {
    sm: "h-1",
    md: "h-2",
    lg: "h-3",
  };

  return (
    <div className={className}>
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <span className="text-sm text-gray-500">{percentage.toFixed(0)}%</span>
      </div>
      <div className={`mt-1 w-full bg-gray-200 rounded-full ${heightClass[size]}`}>
        <div
          className={`${determineColor()} ${heightClass[size]} rounded-full`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}
