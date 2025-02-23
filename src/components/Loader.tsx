import { cn } from "@/lib/utils";

interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
}

export default function Loader({
  size = "lg",
  className,
  ...props
}: LoaderProps) {
  const sizeClasses = {
    sm: "h-16 w-16",
    md: "h-24 w-24",
    lg: "h-32 w-32",
  };

  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn("flex items-center justify-center h-screen", className)}
      {...props}
    >
      <div className={cn("relative", sizeClasses[size])}>
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border-[3px] border-black opacity-20" />

        {/* Spinning gradient ring */}
        <div className="absolute inset-0 animate-[spin_3s_linear_infinite] rounded-full border-[3px] border-transparent border-t-[#FF6943] border-l-black" />

        {/* Inner spinning ring */}
        <div className="absolute inset-2 animate-[spin_2s_linear_infinite] rounded-full border-[3px] border-transparent border-t-black border-r-[#FF6943]" />

        {/* Center dot */}
        <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FF6943]">
          <div className="absolute inset-0 animate-ping rounded-full bg-[#FF6943] opacity-75" />
        </div>
      </div>
      <span className="sr-only">Loading...</span>
    </div>
  );
}
