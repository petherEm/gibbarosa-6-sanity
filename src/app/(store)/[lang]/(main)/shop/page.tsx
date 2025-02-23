import ProductCarousel from "@/components/products/ProductCarousel";
import { getDictionary } from "@/lib/dictionary";

export const dynamic = "force-static";
export const revalidate = 3600; // 1 hour

export default async function Shop({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang as "en" | "pl" | "fr");

  return (
    <>
      <ProductCarousel dict={dict} lang={lang} />
    </>
  );
}
