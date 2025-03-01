import { Container } from "@/components/ui/container";
import { getAllProducts } from "@/sanity/lib/products/getAllProducts";
import ProductsViewWithFilters from "./ProductsViewWithFilters";
import { getAllCategories } from "@/sanity/lib/products/getAllCategories";
import { getAllCollections } from "@/sanity/lib/products/getAllCollections";
import { getAllBrands } from "@/sanity/lib/products/getAllBrands";

export default async function ProductCarousel({ dict, lang }) {
  // Use the regular queries instead of language-specific ones
  const products = await getAllProducts();
  const categories = await getAllCategories();
  const collections = await getAllCollections();
  const brands = await getAllBrands();

  // Calculate max price based on current language
  const maxPrice = Math.max(
    ...products.map((product) => {
      if (!product.pricing) return 0;
      return lang === "pl"
        ? product.pricing.PLN || 0
        : product.pricing.EUR || 0;
    })
  );

  // Debug the first product to see its structure
  if (products.length > 0) {
    console.log("Sample product structure:", {
      id: products[0]._id,
      name: products[0].name,
      pricing: products[0].pricing,
      images: products[0].images,
    });
  }

  return (
    <section className="py-12">
      <Container>
        <div className="space-y-8">
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
