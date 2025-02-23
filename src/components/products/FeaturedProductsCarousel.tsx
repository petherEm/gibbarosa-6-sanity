import { Container } from "@/components/ui/container";
import { getAllCategories } from "@/sanity/lib/products/getAllCategories";
import { getFeaturedProducts } from "@/sanity/lib/products/getFeaturedProducts";
import { getAllCollections } from "@/sanity/lib/products/getAllCollections";
import { getAllBrands } from "@/sanity/lib/products/getAllBrands";
import ProductsViewWithFilters from "@/components/products/ProductsViewWithFilters";

export default async function FeaturedProductsCarousel({ dict, lang }) {
  const products = await getFeaturedProducts();
  const categories = await getAllCategories();
  const collections = await getAllCollections();
  const brands = await getAllBrands();

  // Find max price for the price range slider
  const maxPrice = Math.max(
    ...products.map((product) => product.eurprice || 0)
  );

  return (
    <section className="py-12">
      <Container>
        <div className="space-y-8">
          <h2 className="text-2xl font-bold tracking-tight">
            Featured Products
          </h2>
          <ProductsViewWithFilters
            lang={lang}
            products={products}
            categories={categories}
            collections={collections}
            brands={brands}
            maxPrice={maxPrice}
          />
        </div>
      </Container>
    </section>
  );
}
