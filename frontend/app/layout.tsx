import type { Metadata, Viewport } from "next";
import "./globals.css";

const siteUrl = "https://seo-audit-tool-five-tau.vercel.app";

const siteName = "AI SEO Audit";

const title = "SEO Audit Tool – Free Technical SEO Checker & Website Analyzer";

const description =
  "Free SEO audit tool that checks technical SEO, meta tags, headings and links, then gives AI-powered fixes you can act on.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: title,
    template: "%s | AI SEO Audit",
  },

  description,

  applicationName: siteName,

  authors: [{ name: "AI SEO Audit", url: siteUrl }],
  creator: "AI SEO Audit",
  publisher: "AI SEO Audit",
  category: "SEO Tools",

  // Google ignores the keywords meta tag; kept only as an internal record.
  keywords: [
    "SEO audit tool",
    "free SEO audit tool",
    "technical SEO audit",
    "website SEO checker",
    "SEO checker",
    "website audit tool",
    "free SEO checker",
    "AI SEO audit",
  ],

  alternates: {
    canonical: "/",
  },

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

  // No image is set yet, so use the plain "summary" card.
  // After adding public/og.png (1200x630), add images: ["/og.png"]
  // to openGraph and twitter, and switch card to "summary_large_image".
  twitter: {
    card: "summary",
    title,
    description,
  },

  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
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
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      </head>

      <body>{children}</body>
    </html>
  );
}