import type { Metadata } from "next";
import { Providers } from "@/components/providers/Providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "AURA — The Based Terminal",
  description: "Track the aura of Bags.fm tokens.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="scanlines min-h-screen antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
