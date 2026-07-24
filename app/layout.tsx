import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import SiteChrome from "@/components/SiteChrome";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Legacy Edge Builds | Premium Interior Materials",
  description:
    "Premium interior finishing materials — flooring, wall panels, boards, and furniture accessories — delivered nationwide across Nigeria.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="font-body antialiased">
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
