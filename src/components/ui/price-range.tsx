import React from "react";
import { Slider } from "@/components/ui/slider";
import { useFiltersStore } from "@/store/useFiltersStore";

export const PriceRangeComponent = () => {
  const { priceRange, setPriceRange } = useFiltersStore();

  const handlePriceChange = (value: [number, number]) => {
    setPriceRange({ min: value[0], max: value[1] });
  };

  return (
    <div className="w-full p-4">
      <h3 className="text-lg font-semibold mb-4">Price Range</h3>
      <Slider
        defaultValue={[priceRange.min, priceRange.max]}
        max={1000}
        step={10}
        onValueChange={handlePriceChange}
      />
      <div className="flex justify-between mt-2">
        <span>${priceRange.min}</span>
        <span>${priceRange.max}</span>
      </div>
    </div>
  );
};
