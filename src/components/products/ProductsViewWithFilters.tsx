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
  lang = "EN",
  maxPrice,
}: ProductsViewPropsWithFilters) {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);

  // Helper function to safely extract ID from different reference formats
  const getRefId = (ref: any) => {
    if (!ref) return null;

    if (typeof ref === "string") return ref;

    if (typeof ref === "object") {
      if (ref._id) return ref._id;
      if (ref._ref) return ref._ref;
    }

    return null;
  };

  const handleFilterChange = (filters: FilterState) => {
    let filtered = [...products];

    // Get initial count
    console.log(`Starting with ${filtered.length} products`);

    // Debug the selected filters
    console.log("Applied filters:", JSON.stringify(filters, null, 2));

    // If products have a weird structure, log the first one
    if (products.length > 0) {
      console.log("Sample product:", {
        id: products[0]._id,
        categories: products[0].categories,
        collections: products[0].collections,
        brands: products[0].brands,
      });
    }

    // Filter by category
    if (filters.category) {
      const beforeCount = filtered.length;

      filtered = filtered.filter((product) => {
        if (!product.categories) return false;

        // Convert categories to a simple array of IDs for comparison
        const categoryIds = Array.isArray(product.categories)
          ? product.categories.map((cat) => getRefId(cat))
          : [];

        const result = categoryIds.includes(filters.category);
        return result;
      });

      console.log(
        `Category filter: ${beforeCount} → ${filtered.length} products`
      );
    }

    // Filter by collection
    if (filters.collection) {
      const beforeCount = filtered.length;

      filtered = filtered.filter((product) => {
        if (!product.collections) return false;

        // Convert collections to a simple array of IDs for comparison
        const collectionIds = Array.isArray(product.collections)
          ? product.collections.map((col) => getRefId(col))
          : [];

        const result = collectionIds.includes(filters.collection);
        return result;
      });

      console.log(
        `Collection filter: ${beforeCount} → ${filtered.length} products`
      );
    }

    // Filter by brand
    if (filters.brand) {
      const beforeCount = filtered.length;

      filtered = filtered.filter((product) => {
        if (!product.brands) return false;

        // Convert brands to a simple array of IDs for comparison
        const brandIds = Array.isArray(product.brands)
          ? product.brands.map((brand) => getRefId(brand))
          : [];

        const result = brandIds.includes(filters.brand);
        return result;
      });

      console.log(`Brand filter: ${beforeCount} → ${filtered.length} products`);
    }

    // Filter by price range
    if (
      filters.priceRange &&
      (filters.priceRange[0] > 0 || filters.priceRange[1] < maxPrice)
    ) {
      const beforeCount = filtered.length;

      filtered = filtered.filter((product) => {
        if (!product.pricing) return false;
        const price =
          lang === "pl" ? product.pricing.PLN || 0 : product.pricing.EUR || 0;
        return price >= filters.priceRange[0] && price <= filters.priceRange[1];
      });

      console.log(`Price filter: ${beforeCount} → ${filtered.length} products`);
    }

    // If no results, print more debugging information
    if (filtered.length === 0 && products.length > 0) {
      if (filters.category && categories) {
        const selectedCategory = categories.find(
          (c) => c._id === filters.category
        );
        console.log("Selected category:", selectedCategory);
      }

      if (filters.collection && collections) {
        const selectedCollection = collections.find(
          (c) => c._id === filters.collection
        );
        console.log("Selected collection:", selectedCollection);
      }

      if (filters.brand && brands) {
        const selectedBrand = brands.find((b) => b._id === filters.brand);
        console.log("Selected brand:", selectedBrand);
      }

      // Check the first few products to see their reference structure
      for (let i = 0; i < Math.min(3, products.length); i++) {
        console.log(`Product ${i} references:`, {
          categories: products[i].categories?.map((c) => getRefId(c)),
          collections: products[i].collections?.map((c) => getRefId(c)),
          brands: products[i].brands?.map((b) => getRefId(b)),
        });
      }
    }

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
        currency={lang === "pl" ? "PLN" : "€"}
        lang={lang} // Pass the language to ProductFilters
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
