import type { Metadata } from "next";
import { Inter, Staatliches } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar/navbar";
import { ThemeProviders } from "@/components/ThemeProviders";
import { SanityLive } from "@/sanity/lib/live";
import { VisualEditing } from "next-sanity";
import { draftMode } from "next/headers";
import DisableDraftMode from "@/components/DisableDraftMode";
import { getDictionary } from "@/lib/dictionary";
import Footer from "@/components/Footer";

const staatliches = Staatliches({
  subsets: ["latin"],
  weight: ["400", "400"],
  style: ["normal"],
  display: "swap",
  variable: "--font-staatliches",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Gibbarosa v6 | Sanity Build",
  description: "Gibbarosa v6 | Sanity Build",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${staatliches.variable} ${inter.variable}`}
    >
      <body className={`${staatliches.variable} ${inter.variable}`}>
        {(await draftMode()).isEnabled && (
          <>
            <DisableDraftMode />
            <VisualEditing />
          </>
        )}
        <ThemeProviders attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProviders>

        <SanityLive />
      </body>
    </html>
  );
}
