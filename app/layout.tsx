import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Setting up a clean, modern font
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CertView | Advanced SSL Diagnostics",
  description: "Professional certificate diagnostics for human-readable security insights.",
  keywords: ["SSL", "Security", "Certificate", "Diagnostics", "Next.js", "CertView"],
  authors: [{ name: "Ismail Mahmud Nur" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.className} antialiased transition-colors duration-500`}
      >
        {/* The children prop renders your page.tsx content here */}
        {children}
      </body>
    </html>
  );
}