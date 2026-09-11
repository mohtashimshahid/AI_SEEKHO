import "./globals.css";
import type { Metadata } from "next";
import { AuthProvider } from "@/lib/auth-context";

export const metadata: Metadata = {
  title: "TripSage AI — Multi-Agent Travel Intelligence Agency",
  description: "Transform your travel dreams into structured, verified itineraries using five coordinated AI agents.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-stone-950 text-stone-100 antialiased selection:bg-sage-600 selection:text-white">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
