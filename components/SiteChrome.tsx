"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import LiveChat from "@/components/LiveChat";

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) return <>{children}</>;

  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
      <WhatsAppFloat />
      <LiveChat />
    </>
  );
}
