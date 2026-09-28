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
  description: "Subscription-free smart motion sensors with no hub. Stick on any door, window, or drawer and get instant push notifications. No monthly fees.",
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
  alternates: {
    canonical: "/",
    types: {
      "text/plain": "https://sensestamp.com/llms.txt",
    },
  },
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

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://sensestamp.com/#organization",
      name: "SenseStamp",
      url: "https://sensestamp.com",
      parentOrganization: {
        "@type": "Organization",
        name: "DaSecure Solutions LLC",
        url: "https://dasecure.com",
      },
    },
    {
      "@type": "WebSite",
      "@id": "https://sensestamp.com/#website",
      name: "SenseStamp",
      url: "https://sensestamp.com",
      publisher: { "@id": "https://sensestamp.com/#organization" },
      inLanguage: "en-US",
    },
    {
      "@type": "Product",
      "@id": "https://sensestamp.com/#product",
      name: "SenseStamp",
      description:
        "Subscription-free, hub-free ESP32-C6 motion sensors that HMAC-SHA256 sign every event on-device, with NFC tap verification and public proof URLs.",
      url: "https://sensestamp.com",
      brand: { "@id": "https://sensestamp.com/#organization" },
      manufacturer: { "@id": "https://sensestamp.com/#organization" },
      category: "IoT security sensor",
    },
  ],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
        {children}
      </body>
    </html>
  );
}
