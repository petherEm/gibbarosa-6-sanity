import { Container } from "@/components/ui/container";
import { getAllProducts } from "@/sanity/lib/products/getAllProducts";
import ProductsView from "./ProductsViewWithFilters";
import { getAllCategories } from "@/sanity/lib/products/getAllCategories";
import { getAllCollections } from "@/sanity/lib/products/getAllCollections";
import { getAllBrands } from "@/sanity/lib/products/getAllBrands";

export default async function ProductCarousel({ dict, lang }) {
  const products = await getAllProducts();
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
          <ProductsView
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
