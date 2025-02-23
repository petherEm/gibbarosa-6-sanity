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
}: ProductFiltersProps) {
  const [filters, setFilters] = useState<FilterState>({
    category: "",
    collection: "",
    brand: "",
    priceRange: [0, maxPrice],
  });

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
      priceRange: [0, maxPrice],
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
              {categories.map((category) => (
                <SelectItem key={category._id} value={category._id}>
                  {category.title}
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
              {collections.map((collection) => (
                <SelectItem key={collection._id} value={collection._id}>
                  {collection.EN_title}
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
                  {brand.name}
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

      {/* Price Range Slider - remains unchanged */}
      <div className="space-y-2 max-w-[300px]">
        <div className="flex justify-between text-sm">
          <span>Price range</span>
          <span>
            €{filters.priceRange[0]} - €{filters.priceRange[1]}
          </span>
        </div>
        <Slider
          min={0}
          max={maxPrice}
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
