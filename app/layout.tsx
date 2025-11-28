import type { Metadata } from "next";
import { Outfit, Nunito_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const nunitoSans = Nunito_Sans({
  variable: "--font-nunito",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://academy.alterera.net"),
  title: "Alterera Academy | Learn Industry-Ready Skills",
  description:
    "Alterera Academy offers practical, industry-focused courses designed to help learners master real-world skills with expert guidance and hands-on projects.",
  icons: { icon: "/fav.png" },
  openGraph: {
    title: "Alterera Academy | Upgrade Your Skills with Real-World Learning",
    description:
      "Join Alterera Academy and learn with structured courses, hands-on projects, expert mentorship, and industry-validated certification.",
    url: "https://academy.alterera.net",
    siteName: "Alterera Academy",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Alterera Academy Open Graph Image",
      },
    ],
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Alterera Academy | Learn Industry-Ready Skills",
    description:
      "Master the skills that matter. Explore practical courses with hands-on training, guided mentorship, and lifetime access.",
    images: ["/og.png"],
  },
  alternates: {
    canonical: "https://academy.alterera.net",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${outfit.variable} ${nunitoSans.variable} font-outfit antialiased`}
      >
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
