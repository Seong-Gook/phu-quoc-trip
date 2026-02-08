import type { Metadata } from "next";
import { Playfair_Display, Montserrat } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "Sheraton Phu Quoc Family Trip",
  description: "A luxury family vacation record at Sheraton Phu Quoc Long Beach Resort",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="scroll-smooth">
      <body
        className={`${playfair.variable} ${montserrat.variable} font-sans antialiased bg-[#0f172a] text-slate-200`}
      >
        {children}
      </body>
    </html>
  );
}
