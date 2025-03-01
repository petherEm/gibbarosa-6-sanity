"use client";

import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Category, Collection, Brand } from "../../../sanity.types";

interface ProductFiltersProps {
  categories: Category[];
  collections: Collection[];
  brands: Brand[];
  onFilterChange: (filters: FilterState) => void;
  maxPrice: number;
  currency?: string;
  lang?: string;
}

export interface FilterState {
  category: string;
  collection: string;
  brand: string;
  priceRange: [number, number];
}

export function ProductFilters({
  categories,
  collections,
  brands,
  onFilterChange,
  maxPrice,
  currency = "€",
  lang = "EN",
}: ProductFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    category: "",
    collection: "",
    brand: "",
    priceRange: [0, maxPrice || 10000],
  });

  // Helper function to get localized text based on language
  const getLocalizedText = (obj: any, fallback: string = "Untitled") => {
    if (!obj) return fallback;

    const langKey = lang.toUpperCase();

    // For flattened objects (getXXXForLanguage)
    if (typeof obj === "string") return obj;

    // For full multilingual objects
    if (obj.title) {
      return obj.title[langKey] || obj.title.EN || fallback;
    }

    // For brand objects that might use name instead of title
    if (obj.name) {
      return obj.name[langKey] || obj.name.EN || fallback;
    }

    return fallback;
  };

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const clearFilters = () => {
    const resetFilters = {
      category: "",
      collection: "",
      brand: "",
      priceRange: [0, maxPrice || 10000],
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        {/* Category Filter */}
        <div className="w-full sm:w-auto">
          <Select
            value={filters.category}
            onValueChange={(value) => handleFilterChange({ category: value })}
          >
            <SelectTrigger className="w-full sm:w-[200px] h-12 bg-transparent border-2 border-black/80 hover:border-black">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              {categories?.map((category) => (
                <SelectItem key={category._id} value={category._id}>
                  {getLocalizedText(category, "Category")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Collection Filter */}
        <div className="w-full sm:w-auto">
          <Select
            value={filters.collection}
            onValueChange={(value) => handleFilterChange({ collection: value })}
          >
            <SelectTrigger className="w-full sm:w-[200px] h-12 bg-transparent border-2 border-black/80 hover:border-black">
              <SelectValue placeholder="Filter by collection" />
            </SelectTrigger>
            <SelectContent>
              {collections?.map((collection) => (
                <SelectItem key={collection._id} value={collection._id}>
                  {getLocalizedText(collection, "Collection")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Brand Filter */}
        <div className="w-full sm:w-auto">
          <Select
            value={filters.brand}
            onValueChange={(value) => handleFilterChange({ brand: value })}
          >
            <SelectTrigger className="w-full sm:w-[200px] h-12 bg-transparent border-2 border-black/80 hover:border-black">
              <SelectValue placeholder="Filter by brand" />
            </SelectTrigger>
            <SelectContent>
              {brands?.map((brand) => (
                <SelectItem key={brand._id} value={brand._id}>
                  {getLocalizedText(brand, "Brand")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Clear Filters Button */}
        {(filters.category ||
          filters.collection ||
          filters.brand ||
          filters.priceRange[0] > 0 ||
          filters.priceRange[1] < maxPrice) && (
          <Button variant="ghost" className="px-2 h-12" onClick={clearFilters}>
            <X className="h-4 w-4 mr-2" />
            Clear filters
          </Button>
        )}
      </div>

      {/* Price Range Slider */}
      <div className="space-y-2 max-w-[300px]">
        <div className="flex justify-between text-sm">
          <span>Price range</span>
          <span>
            {currency} {filters.priceRange[0]} - {currency}{" "}
            {filters.priceRange[1]}
          </span>
        </div>
        <Slider
          min={0}
          max={maxPrice || 10000}
          step={50}
          value={filters.priceRange}
          onValueChange={(value) =>
            handleFilterChange({ priceRange: value as [number, number] })
          }
          className="py-4"
        />
      </div>
    </div>
  );
}
