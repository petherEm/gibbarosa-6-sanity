import Link from "next/link";

interface LogoProps {
  size?: "small" | "medium" | "large";
}

export default function Logo({ size = "large" }: LogoProps) {
  const sizeClasses = {
    small: "text-2xl",
    medium: "text-3xl",
    large: "text-4xl",
  };

  return (
    <Link href="/" className="mr-6 flex items-center space-x-2">
      <span
        className={`${sizeClasses[size]} font-normal font-staatliches tracking-wide`}
      >
        Gibbarosa
      </span>
    </Link>
  );
}
