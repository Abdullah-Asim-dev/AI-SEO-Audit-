import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], display: "swap" });

// Change this to your custom domain once you have one.
const siteUrl = "https://seo-audit-tool-five-tau.vercel.app";
const siteName = "AI SEO Audit";
const title = "Free SEO Audit Tool – AI Technical SEO Checker";
const description =
  "Run a free technical SEO audit on any URL. Checks title, meta description, headings, alt text and broken links, then gives AI-written fixes. No signup.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: title, template: "%s | AI SEO Audit" },
  description,
  applicationName: siteName,
  authors: [{ name: siteName, url: siteUrl }],
  creator: siteName,
  publisher: siteName,
  category: "SEO Tools",
  verification: { google: "BrWbSY0vFPvJJ1LibWPHLsaOVRmPcNct4iq5gaenyZM" },
  // Every new page must set its own alternates.canonical, or it inherits "/".
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName,
    title,
    description,
  },
  // The image comes from app/opengraph-image.tsx automatically.
  twitter: { card: "summary_large_image", title, description },
  formatDetection: { email: false, address: false, telephone: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#040911",
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: siteName,
      description,
      inLanguage: "en-US",
    },
    {
      "@type": "WebApplication",
      "@id": `${siteUrl}/#application`,
      name: siteName,
      url: siteUrl,
      description,
      applicationCategory: "BusinessApplication",
      applicationSubCategory: "SEO Audit Tool",
      operatingSystem: "Any",
      browserRequirements: "Requires a modern web browser",
      inLanguage: "en-US",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}