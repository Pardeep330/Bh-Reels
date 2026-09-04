import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BH Reels - Premium Admin & Influencer Platform",
  description: "Exclusive Influencer network, campaign tracking, and reel rate management system.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800;900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#F8FAFC] text-slate-900 min-h-screen antialiased selection:bg-[#D4AF37] selection:text-white">
        {children}
      </body>
    </html>
  );
}
