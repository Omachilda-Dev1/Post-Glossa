"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

export default function ShareButtons({ url, title, vertical = false }: { url: string; title: string; vertical?: boolean }) {
  const t = useTranslations("blog");
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked */
    }
  }

  const item = "block text-sm text-ink/75 hover:text-accent transition-colors";

  return (
    <div className={vertical ? "" : "flex flex-wrap items-center gap-x-5 gap-y-2"}>
      <p className={`kicker ${vertical ? "mb-3" : ""}`}>{t("share")}</p>
      <ul className={vertical ? "space-y-2" : "flex flex-wrap gap-x-5 gap-y-2"}>
        <li>
          <a className={item} target="_blank" rel="noopener noreferrer"
            href={`https://x.com/intent/post?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`}>
            X
          </a>
        </li>
        <li>
          <a className={item} target="_blank" rel="noopener noreferrer"
            href={`https://bsky.app/intent/compose?text=${encodeURIComponent(`${title} ${url}`)}`}>
            Bluesky
          </a>
        </li>
        <li>
          <a className={item} target="_blank" rel="noopener noreferrer"
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}>
            LinkedIn
          </a>
        </li>
        <li>
          <a className={item} href={`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`}>
            Email
          </a>
        </li>
        <li>
          <button onClick={copyLink} className={`${item} text-left`} aria-live="polite">
            {copied ? t("copied") : t("copy_link")}
          </button>
        </li>
      </ul>
    </div>
  );
}
