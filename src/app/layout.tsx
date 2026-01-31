import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SenseStamp - IoT Security Sensors Without Subscriptions",
  description: "Affordable, subscription-free smart motion sensors. Stick on any door, window, or drawer. Get instant push notifications. No hub, no monthly fees, no complexity.",
  keywords: "IoT security, motion sensor, smart home, ESP32, wireless sensor, home security, no subscription",
  authors: [{ name: "SenseStamp" }],
  creator: "SenseStamp",
  publisher: "SenseStamp",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://sensestamp.com"),
  openGraph: {
    title: "SenseStamp - IoT Security Sensors Without Subscriptions",
    description: "Affordable, subscription-free smart motion sensors. Stick on any door, window, or drawer. Get instant push notifications.",
    url: "https://sensestamp.com",
    siteName: "SenseStamp",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SenseStamp - IoT Security Sensors Without Subscriptions",
    description: "Affordable, subscription-free smart motion sensors. No hub, no monthly fees, no complexity.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white`}
      >
        {children}
      </body>
    </html>
  );
}