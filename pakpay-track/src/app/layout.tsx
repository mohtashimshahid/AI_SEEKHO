import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PakPay Track - The Future of Freelance Wealth",
  description: "Extreme speed. Total transparency. 4K-clarity tracking for the modern remote professional.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
