import { Container } from "@/components/ui/container";
import { getFeaturedProducts } from "@/sanity/lib/products/getFeaturedProducts";
import ProductsViewSimple from "./ProductsViewSimple";

interface SimpleProductCarouselProps {
  dict: any;
  lang: string;
}

export default async function SimpleProductCarousel({
  dict,
  lang,
}: SimpleProductCarouselProps) {
  const products = await getFeaturedProducts();

  return (
    <section className="py-12">
      <Container>
        <div className="space-y-8">
          <h2 className="text-2xl font-bold tracking-tight">
            Featured Products
          </h2>
          <ProductsViewSimple lang={lang} products={products} />
        </div>
      </Container>
    </section>
  );
}
