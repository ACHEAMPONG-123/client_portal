import type { Metadata } from "next";
import { Inter_Tight, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Agency Client Portal | Digital Agency & SaaS Hub",
  description: "High-end multi-tenant digital agency client portal for project management, Google Drive deliverables hub, and approvals.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${interTight.variable} ${bricolage.variable}`} suppressHydrationWarning>
      <body className="antialiased bg-[#F2F3F4] text-[#0F172A] min-h-screen" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
