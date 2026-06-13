"use client";

import { useEffect, useState } from "react";
import { markSplashSeenAction } from "@/actions/splash/mark-splash-seen.action";
import { NeoFibraLogo } from "@/components/neofibra-logo";
import { cn } from "@/lib/shadcn/utils";

const HOLD_MS = 1600;
const FADE_MS = 600;

export function SplashClient() {
  const [leaving, setLeaving] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const leave = setTimeout(() => setLeaving(true), HOLD_MS);

    const hide = setTimeout(() => {
      setVisible(false);
      markSplashSeenAction();
    }, HOLD_MS + FADE_MS);

    return () => {
      clearTimeout(leave);
      clearTimeout(hide);
    };
  }, []);

  if (!visible) return null;

  return (
    <output
      aria-label="Carregando NeoFibra"
      className={cn(
        "fixed inset-0 z-50 flex flex-col items-center justify-center gap-5 bg-wa-teal",
        "transition-opacity duration-600 ease-out motion-reduce:transition-none",
        leaving ? "opacity-0" : "opacity-100",
      )}
    >
      <NeoFibraLogo className="size-24 animate-in fade-in zoom-in-95 duration-700 drop-shadow-lg motion-reduce:animate-none" />
      <p className="animate-in fade-in slide-in-from-bottom-2 text-lg font-semibold tracking-wide text-on-accent duration-700 motion-reduce:animate-none">
        NeoFibra
      </p>
    </output>
  );
}
