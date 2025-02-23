import FeaturedProductsCarousel from "@/components/products/FeaturedProductsCarousel";
import { Hero } from "@/components/Hero";
import MidBanner from "@/components/MidBanner";
import ProductCarousel from "@/components/products/ProductCarousel";
import SubHero from "@/components/SubHero";
import Valentines from "@/components/Valentines";
import { getDictionary } from "@/lib/dictionary";
import ProductsViewSimple from "@/components/products/ProductsViewSimple";
import SimpleProductCarousel from "@/components/products/SimpleProductsCarousel";

export const dynamic = "force-static";
export const revalidate = 60 * 60; // 1 hour

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang as "en" | "pl" | "fr");
  return (
    <>
      <Hero dict={dict} lang={lang} />
      {/* <Valentines /> */}
      <SimpleProductCarousel dict={dict} lang={lang} />
      {/* <FeaturedProductsCarousel dict={dict} lang={lang} /> */}
      <SubHero dict={dict} />
      <MidBanner dict={dict} />
      <SimpleProductCarousel dict={dict} lang={lang} />
    </>
  );
}
