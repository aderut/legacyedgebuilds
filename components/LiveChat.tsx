"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";

/**
 * Loads Tawk.to live chat on public pages only (not /admin). Does nothing
 * if the two env vars aren't set — see README for setup, it's free and
 * takes about 5 minutes.
 */
export default function LiveChat() {
  const pathname = usePathname();
  const propertyId = process.env.NEXT_PUBLIC_TAWKTO_PROPERTY_ID;
  const widgetId = process.env.NEXT_PUBLIC_TAWKTO_WIDGET_ID;

  if (!propertyId || !widgetId) return null;
  if (pathname?.startsWith("/admin")) return null;

  return (
    <Script id="tawkto-widget" strategy="lazyOnload">
      {`
        var Tawk_API = Tawk_API || {};
        var Tawk_LoadStart = new Date();
        (function(){
          var s1 = document.createElement("script"), s0 = document.getElementsByTagName("script")[0];
          s1.async = true;
          s1.src = 'https://embed.tawk.to/${propertyId}/${widgetId}';
          s1.charset = 'UTF-8';
          s1.setAttribute('crossorigin', '*');
          s0.parentNode.insertBefore(s1, s0);
        })();
      `}
    </Script>
  );
}
