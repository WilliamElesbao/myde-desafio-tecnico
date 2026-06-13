"use client";

import { motion } from "motion/react";
import type { ElementType } from "react";
import { useMemo } from "react";
import { cn } from "@/lib/shadcn/utils";

export type TextShimmerProps = {
  children: string;
  as?: ElementType;
  className?: string;
  duration?: number;
  spread?: number;
};

/**
 * Animated shimmer text (motion-primitives). A bright gradient sweeps across
 * the text on a loop — used for transient "generating" states.
 *
 * Colors come from the design tokens (--base-color / --base-gradient-color)
 * instead of hard-coded hex, so it follows the global theme.
 */
export function TextShimmer({
  children,
  as: Component = "span",
  className,
  duration = 2,
  spread = 2,
}: TextShimmerProps) {
  const MotionComponent = motion.create(Component);

  // The gradient band scales with the text length so short and long strings
  // shimmer at a similar visual speed.
  const dynamicSpread = useMemo(
    () => children.length * spread,
    [children, spread],
  );

  return (
    <MotionComponent
      className={cn(
        "relative inline-block bg-[length:250%_100%,auto] bg-clip-text text-transparent",
        "[--base-color:var(--color-muted-foreground)] [--base-gradient-color:var(--color-wa-green-dark)]",
        "[--bg:linear-gradient(90deg,#0000_calc(50%-var(--spread)),var(--base-gradient-color),#0000_calc(50%+var(--spread)))]",
        "[background-repeat:no-repeat,padding-box]",
        className,
      )}
      initial={{ backgroundPosition: "100% center" }}
      animate={{ backgroundPosition: "0% center" }}
      transition={{
        repeat: Number.POSITIVE_INFINITY,
        duration,
        ease: "linear",
      }}
      style={{
        "--spread": `${dynamicSpread}px`,
        backgroundImage:
          "var(--bg), linear-gradient(var(--base-color), var(--base-color))",
      }}
    >
      {children}
    </MotionComponent>
  );
}
