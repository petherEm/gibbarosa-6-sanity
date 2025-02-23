"use client";

import { useState } from "react";
import { ProductFilters, type FilterState } from "./ProductFilters";
import ProductThumb from "./ProductThumb";
import type {
  Product,
  Category,
  Collection,
  Brand,
} from "../../../sanity.types";

interface ProductsViewPropsWithFilters {
  products: Product[];
  categories?: Category[];
  collections?: Collection[];
  brands?: Brand[];
  lang?: string;
  maxPrice?: number;
}

export default function ProductsViewWithFilters({
  products,
  categories,
  collections,
  brands,
  lang,
  maxPrice,
}: ProductsViewPropsWithFilters) {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);

  const handleFilterChange = (filters: FilterState) => {
    let filtered = [...products];

    // Filter by category
    if (filters.category) {
      filtered = filtered.filter((product) => {
        // Check if product has categories array
        if (!product.categories || !product.categories.length) return false;

        // Check if any category in the array matches the filter
        return product.categories.some((cat) => {
          const categoryRef = typeof cat === "object" ? cat._ref : cat;
          return categoryRef === filters.category;
        });
      });
    }

    // Filter by collection (unchanged)
    if (filters.collection) {
      filtered = filtered.filter((product) => {
        if (!product.collections) return false;
        return product.collections.some((col) => {
          const collectionRef = typeof col === "object" ? col._ref : col;
          return collectionRef === filters.collection;
        });
      });
    }

    // Filter by brand
    if (filters.brand) {
      filtered = filtered.filter((product) => {
        if (!product.brands?.length) return false;
        return product.brands.some((brand) => {
          const brandRef = typeof brand === "object" ? brand._ref : brand;
          return brandRef === filters.brand;
        });
      });
    }

    // Filter by price range
    filtered = filtered.filter((product) => {
      const price = product.eurprice || 0;
      return price >= filters.priceRange[0] && price <= filters.priceRange[1];
    });

    setFilteredProducts(filtered);
  };

  return (
    <div className="space-y-6">
      <ProductFilters
        categories={categories}
        collections={collections}
        brands={brands}
        onFilterChange={handleFilterChange}
        maxPrice={maxPrice}
      />

      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">
            No products match your filters
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductThumb key={product._id} product={product} lang={lang} />
          ))}
        </div>
      )}
    </div>
  );
}
