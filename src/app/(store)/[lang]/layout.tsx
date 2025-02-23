import type { Metadata } from "next";

import { getDictionary } from "@/lib/dictionary";
import Navbar from "@/components/navbar/navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Gibbarosa v6 | Sanity Build",
  description: "Gibbarosa v6 | Sanity Build",
};

export default async function PageLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = await params;
  const dict = await getDictionary(lang as "en" | "pl" | "fr");
  return (
    <>
      <Navbar dict={dict} lang={lang} />
      {children}
      <Footer dict={dict} lang={lang} />
    </>
  );
}
