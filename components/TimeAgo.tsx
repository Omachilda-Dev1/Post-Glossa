"use client";

import { useEffect, useState } from "react";
import { timeAgo } from "@/lib/format";

/**
 * Relative timestamp ("12 min ago") that keeps itself current on the client.
 * The server renders the same text; pages are regenerated every few minutes,
 * so the initial value is close and the client corrects it after mount.
 */
export default function TimeAgo({ iso, locale, className }: { iso: string; locale: string; className?: string }) {
  const [label, setLabel] = useState(() => timeAgo(iso, locale));

  useEffect(() => {
    setLabel(timeAgo(iso, locale));
    const id = setInterval(() => setLabel(timeAgo(iso, locale)), 60_000);
    return () => clearInterval(id);
  }, [iso, locale]);

  return (
    <time dateTime={iso} className={className} suppressHydrationWarning title={new Date(iso).toUTCString()}>
      {label}
    </time>
  );
}
