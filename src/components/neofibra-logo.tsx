import { cn } from "@/lib/shadcn/utils";

type NeoFibraLogoProps = {
  className?: string;
  title?: string;
};

export function NeoFibraLogo({
  className,
  title = "NeoFibra",
}: Readonly<NeoFibraLogoProps>) {
  const decorative = title.length === 0;

  return (
    <svg
      viewBox="0 0 96 96"
      className={cn("block", className)}
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : title}
      aria-hidden={decorative || undefined}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title || "NeoFibra"}</title>
      <defs>
        <linearGradient id="neofibra-logo-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--color-wa-green)" />
          <stop offset="100%" stopColor="var(--color-wa-teal)" />
        </linearGradient>
      </defs>

      <rect
        width="96"
        height="96"
        rx="22"
        fill="url(#neofibra-logo-gradient)"
      />

      <g
        fill="none"
        stroke="var(--color-on-accent)"
        strokeLinecap="round"
        opacity="0.55"
      >
        <path d="M64 26a18 18 0 0 1 12 12" strokeWidth="3" />
        <path d="M62 36a9 9 0 0 1 6 6" strokeWidth="3" />
      </g>

      <text
        x="50%"
        y="56%"
        dominantBaseline="middle"
        textAnchor="middle"
        fill="var(--color-on-accent)"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontSize="42"
        fontWeight="700"
        letterSpacing="-1"
      >
        NF
      </text>
    </svg>
  );
}
